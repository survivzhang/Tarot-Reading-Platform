import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPaymentConfirmationEmail, sendReferralRewardEmail } from '@/lib/email/client';

// POST /api/payments/webhook - Handle payment provider webhooks
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerOrderId, status } = body;

    if (!providerOrderId || !status) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { providerOrderId },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Already processed' });
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: status === 'succeeded' ? 'COMPLETED' : 'FAILED' },
    });

    if (status === 'succeeded') {
      // Grant credits to user
      if (transaction.isLifetimeUpgrade) {
        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            isLifetimeMember: true,
            lifetimeMemberSince: new Date(),
            lifetimeYearStart: new Date(),
          },
        });
      } else if (transaction.type === 'TIP' && transaction.readingsGranted! > 0) {
        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            freeReadingsLeft: { increment: transaction.readingsGranted! },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            paidReadingsLeft: { increment: transaction.readingsGranted! },
          },
        });
      }

      // Send confirmation email
      try {
        await sendPaymentConfirmationEmail(
          transaction.user.email,
          transaction.readingsGranted || 0,
          transaction.isLifetimeUpgrade
        );
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }

      // Check for referral reward
      const referral = await prisma.referral.findUnique({
        where: { referredId: transaction.userId },
        include: { referrer: true },
      });

      if (referral && !referral.rewardGranted) {
        // Grant 1 free reading to referrer
        await prisma.user.update({
          where: { id: referral.referrerId },
          data: { freeReadingsLeft: { increment: 1 } },
        });

        await prisma.referral.update({
          where: { id: referral.id },
          data: { rewardGranted: true },
        });

        try {
          await sendReferralRewardEmail(referral.referrer.email);
        } catch (error) {
          console.error('Error sending referral reward email:', error);
        }
      }
    }

    return NextResponse.json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { createSession } from '@/lib/auth/session';
import { detectRegion } from '@/lib/geo/detect-region';
import type { CreateReadingInput } from '@/types/tarot';

// POST /api/readings - Create new reading
export async function POST(request: Request) {
  try {
    const body: CreateReadingInput = await request.json();
    const { email, question, language, cards, referrerId } = body;

    if (!email || !question || !cards || cards.length !== 3) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const region = detectRegion(request);

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          region,
          freeReadingsLeft: 2,
        },
      });

      // Handle referral if provided
      if (referrerId) {
        const referrer = await prisma.user.findUnique({ where: { id: referrerId } });
        if (referrer) {
          await prisma.referral.create({
            data: {
              referrerId,
              referredId: user.id,
            },
          });
        }
      }

      // Create session for new user
      await createSession(user.id, user.email);
    }

    // Check if user has available readings
    const hasCredits =
      user.freeReadingsLeft > 0 ||
      user.paidReadingsLeft > 0 ||
      (user.isLifetimeMember && user.lifetimeReadingsThisYear < 365);

    if (!hasCredits) {
      return NextResponse.json(
        { error: 'No reading credits available' },
        { status: 402 }
      );
    }

    // Create reading
    const reading = await prisma.reading.create({
      data: {
        userId: user.id,
        question,
        language,
        status: 'PENDING',
      },
    });

    // Create drawn cards
    await Promise.all(
      cards.map((card) =>
        prisma.drawnCard.create({
          data: {
            readingId: reading.id,
            cardId: card.cardId,
            position: card.position,
            isReversed: card.isReversed,
          },
        })
      )
    );

    // Deduct credits
    if (user.freeReadingsLeft > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { freeReadingsLeft: { decrement: 1 } },
      });
    } else if (user.paidReadingsLeft > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { paidReadingsLeft: { decrement: 1 } },
      });
    } else if (user.isLifetimeMember) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lifetimeReadingsThisYear: { increment: 1 } },
      });
    }

    // Trigger AI interpretation asynchronously
    // In production, use a job queue (Bull, BullMQ, Inngest, etc.)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readingId: reading.id }),
    }).catch((error) => console.error('Error triggering AI interpretation:', error));

    return NextResponse.json({
      readingId: reading.id,
      status: reading.status,
    });
  } catch (error) {
    console.error('Error creating reading:', error);
    return NextResponse.json({ error: 'Failed to create reading' }, { status: 500 });
  }
}

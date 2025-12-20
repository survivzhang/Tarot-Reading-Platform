import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/auth/session';
import { detectRegion } from '@/lib/geo/detect-region';
import { sendWelcomeEmail } from '@/lib/email/client';

// POST /api/auth/signup - Create new user
export async function POST(request: Request) {
  try {
    const { email, referredBy } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const region = detectRegion(request);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        region,
        freeReadingsLeft: 2,
      },
    });

    // Handle referral
    if (referredBy) {
      const referrer = await prisma.user.findUnique({ where: { id: referredBy } });
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referredBy,
            referredId: user.id,
          },
        });
      }
    }

    // Create session
    await createSession(user.id, user.email);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.freeReadingsLeft);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't fail signup if email fails
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      freeReadingsLeft: user.freeReadingsLeft,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

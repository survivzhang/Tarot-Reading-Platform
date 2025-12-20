import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession } from '@/lib/auth/session';

// POST /api/auth/signin - Sign in existing user
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create session
    await createSession(user.id, user.email);

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      freeReadingsLeft: user.freeReadingsLeft,
      paidReadingsLeft: user.paidReadingsLeft,
      isLifetimeMember: user.isLifetimeMember,
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
  }
}

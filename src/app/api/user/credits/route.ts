import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

// GET /api/user/credits - Get user's reading credits
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        freeReadingsLeft: true,
        paidReadingsLeft: true,
        isLifetimeMember: true,
        lifetimeReadingsThisYear: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalReadingsAvailable = user.isLifetimeMember
      ? 365 - user.lifetimeReadingsThisYear
      : user.freeReadingsLeft + user.paidReadingsLeft;

    return NextResponse.json({
      freeReadingsLeft: user.freeReadingsLeft,
      paidReadingsLeft: user.paidReadingsLeft,
      isLifetimeMember: user.isLifetimeMember,
      lifetimeReadingsThisYear: user.lifetimeReadingsThisYear,
      totalReadingsAvailable,
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

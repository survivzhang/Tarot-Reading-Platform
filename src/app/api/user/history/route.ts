import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

// GET /api/user/history - Get user's reading history
export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [readings, total] = await Promise.all([
      prisma.reading.findMany({
        where: { userId: session.userId },
        include: {
          drawnCards: {
            include: {
              card: {
                select: {
                  name: true,
                  nameZh: true,
                  imageUrl: true,
                },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.reading.count({
        where: { userId: session.userId },
      }),
    ]);

    return NextResponse.json({
      readings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reading history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

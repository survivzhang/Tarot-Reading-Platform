import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/readings/:id - Get reading by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
      include: {
        drawnCards: {
          include: {
            card: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        user: {
          select: {
            email: true,
            region: true,
          },
        },
      },
    });

    if (!reading) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 });
    }

    return NextResponse.json(reading);
  } catch (error) {
    console.error('Error fetching reading:', error);
    return NextResponse.json({ error: 'Failed to fetch reading' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { interpretReading } from '@/lib/ai/client';

// POST /api/ai/interpret - Interpret a reading with AI
export async function POST(request: Request) {
  try {
    const { readingId } = await request.json();

    if (!readingId) {
      return NextResponse.json({ error: 'Reading ID is required' }, { status: 400 });
    }

    // Fetch reading with cards
    const reading = await prisma.reading.findUnique({
      where: { id: readingId },
      include: {
        drawnCards: {
          include: {
            card: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!reading) {
      return NextResponse.json({ error: 'Reading not found' }, { status: 404 });
    }

    if (reading.status === 'COMPLETED') {
      return NextResponse.json({ interpretation: reading.interpretation });
    }

    // Prepare cards for AI
    const cards = reading.drawnCards.map((dc) => ({
      name: dc.card.name,
      nameZh: dc.card.nameZh,
      position: dc.position,
      isReversed: dc.isReversed,
      meaningUpright: dc.card.meaningUpright,
      meaningReversed: dc.card.meaningReversed,
      meaningUprightZh: dc.card.meaningUprightZh,
      meaningReversedZh: dc.card.meaningReversedZh,
    }));

    // Get AI interpretation
    const interpretation = await interpretReading({
      cards,
      question: reading.question,
      language: reading.language,
    });

    // Update reading with interpretation
    await prisma.reading.update({
      where: { id: readingId },
      data: {
        interpretation,
        aiModel: 'gpt-4',
        interpretedAt: new Date(),
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Error interpreting reading:', error);

    // Mark reading as failed
    try {
      await prisma.reading.update({
        where: { id: (await request.json()).readingId },
        data: { status: 'FAILED' },
      });
    } catch {}

    return NextResponse.json({ error: 'Failed to interpret reading' }, { status: 500 });
  }
}

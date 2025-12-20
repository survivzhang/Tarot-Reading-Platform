import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all cards
export async function GET() {
  try {
    const cards = await prisma.tarotCard.findMany();
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add a new card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCard = await prisma.tarotCard.create({
      data: body
    });
    return NextResponse.json(newCard);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}


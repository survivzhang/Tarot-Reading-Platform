import { PrismaClient } from '@prisma/client';
import { TAROT_CARDS } from '../src/lib/tarot/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Starting tarot card seeding...');

  // Clear existing cards (optional - be careful in production!)
  // await prisma.tarotCard.deleteMany({});
  // console.log('Cleared existing cards');

  // Seed all 78 tarot cards
  for (const cardData of TAROT_CARDS) {
    await prisma.tarotCard.upsert({
      where: { cardNumber: cardData.cardNumber },
      update: cardData,
      create: cardData,
    });
  }

  console.log(`✅ Successfully seeded ${TAROT_CARDS.length} tarot cards`);

  // Verify the count
  const count = await prisma.tarotCard.count();
  console.log(`📊 Total cards in database: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

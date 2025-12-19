import prisma from '@/lib/prisma';
import type { TarotCard } from '.prisma/client';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export default async function Home() {
  // This runs on the SERVER and fetches from your local Postgres
  let cards: TarotCard[] = [];
  try {
    cards = await prisma.tarotCard.findMany();
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue with empty cards array if database is unavailable
    cards = [];
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-purple-400 mb-4">
          Tarot Reading Platform
        </h1>
        <p className="text-slate-400 italic">&ldquo;The cards are a mirror to the soul.&rdquo;</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.length === 0 ? (
          <div className="col-span-full text-center p-12 border-2 border-dashed border-slate-700 rounded-xl">
            <p>Your deck is empty. Add a card in Prisma Studio!</p>
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="group bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-purple-500 transition-all duration-300 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                <span className="text-xs font-mono bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                  {card.arcana}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Upright</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.meaningUpright}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Reversed</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.meaningReversed}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
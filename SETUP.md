# AI Tarot Life - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/tarot_db"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI API - Add at least one (Required for AI interpretation)
OPENAI_API_KEY="sk-..."          # Get from https://platform.openai.com/
# OR
ANTHROPIC_API_KEY="sk-ant-..."   # Get from https://console.anthropic.com/

# Email (Optional - for notifications)
SENDGRID_API_KEY="SG...."
FROM_EMAIL="noreply@aitarotlife.com"

# Payments (Optional - for production)
STRIPE_SECRET_KEY="sk_test_..."  # Get from https://stripe.com/
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with 78 tarot cards
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── api/               # API routes
│   ├── reading/[id]/      # Reading result page
│   ├── purchase/          # Purchase page
│   ├── history/           # Reading history
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── tarot/            # Tarot-specific components
│   ├── forms/            # Form components
│   ├── payment/          # Payment components
│   └── reading/          # Reading display
├── lib/                   # Utilities
│   ├── tarot/            # Card deck logic
│   ├── ai/               # AI integration
│   ├── payments/         # Payment providers
│   ├── email/            # Email client
│   ├── geo/              # Region detection
│   └── auth/             # Session management
├── config/                # Configuration
│   ├── payment.config.ts  # Regional pricing
│   ├── ai.config.ts       # AI prompts
│   └── tarot.config.ts    # Tarot settings
└── types/                 # TypeScript types
```

---

## 🎴 Features Implemented

### ✅ Core Reading Flow
- Card drawing with smooth animations
- Past, Present, Future spread
- Upright/Reversed card meanings
- AI-powered interpretation (OpenAI GPT-4 / Anthropic Claude)
- Bilingual support (English & Chinese)

### ✅ User Management
- Email-only authentication (no passwords)
- Session management
- 2 free readings on signup
- Reading history

### ✅ Payment System
- Regional pricing (China vs International)
- Stripe integration (international)
- Alipay/WeChat Pay stubs (China)
- Tip system (earn free readings)
- Bundle packages
- Lifetime membership (365 readings/year)

### ✅ Referral System
- Share referral links
- Earn 1 free reading when friend signs up

---

## 🗄️ Database Models

- **TarotCard** - 78 cards with meanings
- **User** - User accounts with credits
- **Reading** - Tarot readings with AI interpretations
- **DrawnCard** - Cards drawn in each reading
- **Transaction** - Payment history
- **Referral** - Referral tracking

---

## 🔑 API Endpoints

### Cards
- `GET /api/cards` - Get all tarot cards

### Readings
- `POST /api/readings` - Create new reading
- `GET /api/readings/:id` - Get reading by ID
- `POST /api/ai/interpret` - Trigger AI interpretation

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in

### User
- `GET /api/user/credits` - Get reading credits
- `GET /api/user/history` - Get reading history

### Payments
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/webhook` - Payment webhooks

---

## 🎨 UI Components

### Base Components
- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Modal` - Modal dialog
- `LoadingSpinner` - Loading indicator

### Tarot Components
- `TarotCard` - Single card with flip animation
- `CardDeck` - Interactive card deck
- `CardRow` - Display 3 cards horizontally
- `CardDrawAnimation` - Card draw animation

### Forms
- `UserInfoForm` - Email + question input
- `SignInForm` - Sign-in modal

### Payment
- `PricingCards` - Pricing options
- `TipButton` - Tip modal

### Reading
- `InterpretationDisplay` - AI result display
- `ActionButtons` - Next reading / Tip buttons

---

## 🧪 Testing

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

---

## 🚢 Deployment Checklist

1. **Database**
   - Deploy PostgreSQL (Vercel Postgres, Supabase, etc.)
   - Run migrations: `npm run prisma:migrate deploy`
   - Seed cards: `npm run prisma:seed`

2. **Environment Variables**
   - Set all production env vars
   - Update `NEXT_PUBLIC_APP_URL`

3. **Payments**
   - Set up Stripe webhooks
   - Test payment flow in sandbox mode
   - Switch to live API keys

4. **Email**
   - Configure SendGrid domain
   - Test email delivery

5. **Assets**
   - Upload 78 tarot card images to `/public/cards/`
   - Optimize images (WebP, <100KB)

---

## 📝 TODO: Production Enhancements

- [ ] Add Next.js Image Optimization for card images
- [ ] Implement proper authentication (NextAuth.js)
- [ ] Add rate limiting to API routes
- [ ] Set up proper logging (Sentry, LogRocket)
- [ ] Add analytics (Google Analytics, PostHog)
- [ ] Implement job queue for AI interpretations (Bull, Inngest)
- [ ] Add email templates with proper styling
- [ ] Implement proper Alipay/WeChat Pay integration
- [ ] Add unit tests and E2E tests
- [ ] Set up CI/CD pipeline
- [ ] Add dark mode support
- [ ] Implement i18n properly
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Optimize bundle size

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: Check that PostgreSQL is running and `DATABASE_URL` is correct.

### Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```
**Solution**: Run `npm run prisma:generate`

### AI Interpretation Fails
```
Error: OPENAI_API_KEY is not configured
```
**Solution**: Add your OpenAI API key to `.env`

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

## 📄 License

This project is for educational purposes.

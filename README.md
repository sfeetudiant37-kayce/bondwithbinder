# Binder - Professional Marketplace for Cameroon

A marketplace app connecting service providers with clients in Cameroon using swipe-based discovery and a sophisticated FitScore algorithm.

## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your NEXTAUTH_SECRET (any random string).

3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Test Accounts (Pre-populated)

Sign in with any of these accounts to explore different scenarios:

**Scenario 1 - Client with interested providers:**
- Email: marie@binder.cm
- Password: password123
- Has 1 posted request with multiple providers interested

**Scenario 2 - Provider with active swipes:**
- Email: paul@binder.cm
- Password: password123
- Has swiped on requests and has notifications

**Scenario 3 - Dual-role user:**
- Email: jp@binder.cm
- Password: password123
- Acts as both client and provider

**Scenario 4 - New user:**
- Email: sarah@binder.cm
- Password: password123
- Empty state for demonstrating first-time experience

## Features

- Complete authentication flow with NextAuth.js
- Objective-based onboarding
- Swipe-based discovery with Framer Motion animations
- Asymmetric matching (provider swipe reveals info to client)
- Real-time messaging between matched users
- Dual-role identity (switch client/provider without logout)
- Interested providers pool for clients
- 7-factor FitScore algorithm with transparency
- Rating and review system
- Bilingual English/French support
- Progressive Web App (installable)
- SQLite database (no external services needed)

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

## Color Palette

- Primary (Royal Blue): #1E40AF
- Destructive (Red): #DC2626
- White: #FFFFFF
- Primary Light: #DBEAFE
- Primary Dark: #1E3A8A

## Project Structure

```
binder/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (onboarding)/      # Onboarding flow
│   ├── (main)/            # Main application
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── lib/
│   ├── algorithms/        # FitScore algorithm
│   ├── stores/            # Zustand stores
│   └── utils/             # Utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── types/                 # TypeScript types
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open database GUI

## FitScore Algorithm

The FitScore is calculated using a 7-factor weighted composition:

1. **Skill Match** (20%): Jaccard similarity between needed and offered skills
2. **Location** (15%): Whether provider and client are in the same city
3. **Price Fit** (15%): How close the price is to the budget
4. **Rating** (15%): Provider's average rating on 5-point scale
5. **Availability** (10%): Immediate vs flexible timing
6. **Profile Quality** (10%): Completeness of profile
7. **Experience** (15%): Years of experience (capped at 10)

Weights adjust dynamically based on user swipe patterns.

## Testing Scenarios

### Scenario 1: Marie (Client)
1. Login as marie@binder.cm
2. Go to "Interested" tab to see providers who want to work with you
3. View Paul Ekwalla's profile (87% FitScore)
4. Start a conversation with Paul

### Scenario 2: Paul (Provider)
1. Login as paul@binder.cm
2. Browse "Discover" to see client requests
3. Swipe right on requests that match your skills
4. Check "Notifications" for client interest

### Scenario 3: Jean-Pierre (Dual Role)
1. Login as jp@binder.cm
2. Toggle between Client and Provider modes in the header
3. View matches as both client and provider
4. See how content changes based on role

### Scenario 4: Sarah (New User)
1. Login as sarah@binder.cm
2. Experience the onboarding flow
3. See empty states for all features
4. Understand first-time user experience

## License

MIT

# ZotPool Development Document

> **Last Updated:** January 2025
> **Version:** 1.0
> **Status:** Prototype Complete, Backend Integration Pending

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Target Users](#2-problem-statement--target-users)
3. [Current Implementation Status](#3-current-implementation-status)
4. [Architecture & Tech Stack](#4-architecture--tech-stack)
5. [Data Models](#5-data-models)
6. [Feature Roadmap](#6-feature-roadmap)
7. [Backend API Specification](#7-backend-api-specification)
8. [Security Considerations](#8-security-considerations)
9. [UI/UX Design System](#9-uiux-design-system)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Success Metrics](#12-success-metrics)
13. [Implementation Priorities](#13-implementation-priorities)

---

## 1. Executive Summary

**ZotPool** is a carpooling platform designed exclusively for UC Irvine students. The platform connects drivers with empty seats to passengers who need rides, facilitating cost-sharing, reducing environmental impact, and building community among UCI commuters.

### Core Value Propositions

| Stakeholder | Value |
|-------------|-------|
| **Drivers** | Fill empty seats, split gas/parking costs, reduce solo driving |
| **Passengers** | Affordable transportation, no parking permit needed, convenient commute |
| **UCI** | Reduced traffic, fewer parking demands, sustainability goals |
| **Environment** | Lower emissions, reduced carbon footprint per student |

### Current State

The frontend prototype is **fully functional** with:
- Complete UI/UX implementation
- Mock data layer with realistic sample data
- All core user flows implemented
- Mapbox integration for route visualization

### What's Needed

1. **Backend infrastructure** (authentication, database, API)
2. **Real-time matching algorithm**
3. **Notification system**
4. **Payment integration** (optional)
5. **Mobile responsiveness polish**

---

## 2. Problem Statement & Target Users

### The Problem

UCI has approximately 36,000+ students, with a significant portion commuting daily from surrounding cities. These commuters face:

- **High costs**: Gas prices, $900+/year parking permits, vehicle maintenance
- **Limited parking**: Overcrowded lots, long walks from remote parking
- **Traffic congestion**: I-405 and surrounding freeways are heavily congested
- **Environmental impact**: Single-occupancy vehicles contribute to emissions
- **Social isolation**: Long solo commutes are mentally draining

### Use Cases

#### Academic Quarter Commuting
Students commuting from cities like:
- Irvine, Tustin, Santa Ana (10-15 min)
- Anaheim, Fullerton, Orange (20-30 min)
- Long Beach, LA, Riverside (40-60+ min)

**Pattern**: Regular weekly schedule, recurring rides (MWF or TTh classes)

#### Holiday Travel
Students needing rides to/from airports during:
- Thanksgiving Break
- Winter Break
- Spring Break
- Summer travel

**Pattern**: One-time trips, flexible dates, luggage accommodation

#### Special Events
- Sports games at UCI
- Campus events
- Study groups
- Off-campus activities

### Target User Personas

#### 1. The Budget-Conscious Commuter
- **Profile**: Undergraduate, lives with family in nearby city, limited budget
- **Needs**: Affordable daily transportation, no parking costs
- **Behavior**: Consistent schedule, price-sensitive, prefers recurring arrangements

#### 2. The Eco-Conscious Driver
- **Profile**: Graduate student, owns a car, environmentally motivated
- **Needs**: Fill empty seats, reduce carbon footprint, offset gas costs
- **Behavior**: Flexible, community-oriented, uses app to find passengers

#### 3. The Long-Distance Traveler
- **Profile**: Out-of-state student, no car, needs airport rides during breaks
- **Needs**: Reliable rides to LAX/SNA/ONT during holidays
- **Behavior**: Plans ahead, willing to pay premium for convenience

#### 4. The Flexible Both-Role User
- **Profile**: Junior/Senior with car, but sometimes prefers not to drive
- **Needs**: Option to drive when convenient, ride when not
- **Behavior**: Switches roles based on day/situation

---

## 3. Current Implementation Status

### Pages & Features

| Page | Status | Features Implemented | Gaps |
|------|--------|---------------------|------|
| **Landing** | Complete | Hero section, feature cards, CTAs, animations | None |
| **Login** | Complete | Email input, validation UI, Google button (placeholder) | No real auth, Google not functional |
| **SignUp** | Complete | Same as Login | Same as Login |
| **Onboarding** | Complete | 5-step form, all fields, role selection | No data persistence |
| **Dashboard** | Complete | Action cards, stats, recent activity | Stats are hardcoded (0), no real activity |
| **Browse** | Complete | Filtering, post cards, map preview, detail modal | No real-time updates, no matching |
| **CreatePost** | Complete | Driver/passenger toggle, schedule, map preview | No edit functionality, no validation feedback |
| **Profile** | Complete | User info, active listings | No edit capability, avatar upload broken |

### Components

| Component | Status | Notes |
|-----------|--------|-------|
| **Layout** | Complete | Responsive nav, footer, mobile menu |
| **RouteMap** | Complete | Mapbox integration, geocoding, route display |
| **PostCard** | Complete | (Inline in Browse.tsx) Could be extracted |
| **InputField** | Complete | (Inline in Onboarding.tsx) Could be shared |
| **SelectField** | Complete | (Inline, duplicated) Should be shared |

### State Management

| Feature | Status | Notes |
|---------|--------|-------|
| User state | Working | In-memory, resets on refresh |
| Posts state | Working | Mock data, no persistence |
| Login | Working | Email validation only |
| Logout | Working | Clears user state |
| Create Post | Working | Adds to local array |
| Filter Posts | Working | Client-side filtering |

### Known Issues & Limitations

1. **No data persistence** - All state resets on page refresh
2. **No real authentication** - Any @uci.edu email works
3. **Google Sign-In** - Button exists but non-functional
4. **Profile editing** - No implementation
5. **Post editing/deletion** - Not implemented
6. **Avatar upload** - UI exists but non-functional
7. **Duplicate components** - SelectField, InputField defined multiple times
8. **No form validation** - Minimal client-side validation
9. **No loading states** - Some operations lack feedback
10. **Hardcoded stats** - Dashboard shows "0" for everything

---

## 4. Architecture & Tech Stack

### Current Stack

```
Frontend
├── React 19.2.1          # UI library
├── TypeScript 5.8        # Type safety
├── React Router 7        # Client-side routing (HashRouter)
├── Tailwind CSS (CDN)    # Styling
├── Mapbox GL 3.17        # Maps & routing
├── Lucide React          # Icons
└── Vite 6.2              # Build tool
```

### Project Structure

```
zotpool/
├── index.html            # Entry point, Tailwind config, global styles
├── index.tsx             # React mount point
├── App.tsx               # Router & route definitions
├── types.ts              # TypeScript interfaces
├── context/
│   └── AppContext.tsx    # Global state management
├── components/
│   ├── Layout.tsx        # Navigation & footer wrapper
│   └── RouteMap.tsx      # Mapbox map component
├── pages/
│   ├── Landing.tsx       # Public landing page
│   ├── Login.tsx         # Login page
│   ├── SignUp.tsx        # Sign up page
│   ├── Onboarding.tsx    # 5-step profile setup
│   ├── Dashboard.tsx     # User home
│   ├── Browse.tsx        # Post listing & filtering
│   ├── CreatePost.tsx    # Create ride post
│   └── Profile.tsx       # User profile
├── services/
│   └── mockData.ts       # Mock users & posts
├── docs/                 # Documentation (this folder)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Recommended Backend Stack

For production deployment, we recommend:

```
Backend (Recommended)
├── Supabase              # Backend-as-a-Service
│   ├── PostgreSQL        # Database
│   ├── Auth              # Authentication (email, OAuth)
│   ├── Realtime          # Live subscriptions
│   ├── Storage           # Avatar/file uploads
│   └── Edge Functions    # Serverless logic
│
└── Alternative Options
    ├── Firebase          # Google ecosystem
    ├── AWS Amplify       # AWS ecosystem
    └── Custom (Node.js)  # Full control
```

### Why Supabase?

1. **Built-in Auth** - Email/password, OAuth (Google), magic links
2. **PostgreSQL** - Powerful queries, full-text search, geospatial (PostGIS)
3. **Realtime** - Live updates for posts, matches, notifications
4. **Row-Level Security** - Secure data access by user
5. **Storage** - Avatar uploads, file handling
6. **Free Tier** - Generous limits for MVP

---

## 5. Data Models

### Current TypeScript Interfaces

```typescript
// types.ts

export type UserRole = 'driver' | 'passenger' | 'both';
export type CarCleanliness = 1 | 2 | 3 | 4 | 5;
export type CostType = 'free' | 'split_gas' | 'split_gas_parking' | 'negotiable';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gender?: string;
  pronouns?: string;
  city?: string;
  major?: string;
  year?: string;
  socials?: {
    instagram?: string;
    discord?: string;
    phone?: string;
  };
  role?: UserRole;
  isOnboarded: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'driver' | 'passenger';
  origin: string;
  destination: string;
  schedule: {
    days: string[];
    timeStart: string;
    timeEnd: string;
    isRecurring: boolean;
  };
  details: {
    carType?: string;
    seats?: number;
    cleanliness?: CarCleanliness;
    yearsDriving?: number;
    genderPreference?: 'any' | 'same';
    costType?: CostType;
    notes?: string;
  };
  createdAt: string;
}
```

### Proposed Database Schema (PostgreSQL/Supabase)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  gender TEXT,
  pronouns TEXT,
  city TEXT,
  zip_code TEXT,
  major TEXT,
  year TEXT,
  role user_role DEFAULT 'passenger',
  is_onboarded BOOLEAN DEFAULT FALSE,
  phone TEXT,
  instagram TEXT,
  discord TEXT,
  linkedin TEXT,
  allow_email_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom types
CREATE TYPE user_role AS ENUM ('driver', 'passenger', 'both');
CREATE TYPE post_type AS ENUM ('driver', 'passenger');
CREATE TYPE cost_type AS ENUM ('free', 'split_gas', 'split_gas_parking', 'negotiable');
CREATE TYPE gender_preference AS ENUM ('any', 'same');

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type post_type NOT NULL,

  -- Location
  origin TEXT NOT NULL,
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  destination TEXT NOT NULL DEFAULT 'UCI',
  destination_lat DECIMAL(10, 8) DEFAULT 33.6405,
  destination_lng DECIMAL(11, 8) DEFAULT -117.8443,

  -- Schedule
  days TEXT[] NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,

  -- Driver details (nullable for passengers)
  car_type TEXT,
  seats_available INTEGER CHECK (seats_available BETWEEN 1 AND 6),
  cleanliness INTEGER CHECK (cleanliness BETWEEN 1 AND 5),
  years_driving INTEGER,
  cost_type cost_type,

  -- Shared details
  gender_preference gender_preference DEFAULT 'any',
  notes TEXT,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table (for tracking connections)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, cancelled
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Conversations/Messages (optional for in-app messaging)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (optional for trust system)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_origin ON posts(origin);
CREATE INDEX idx_posts_is_active ON posts(is_active);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_matches_post_id ON matches(post_id);
CREATE INDEX idx_matches_requester_id ON matches(requester_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Active posts are viewable by authenticated users"
  ON posts FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## 6. Feature Roadmap

### Phase 1: MVP (4-6 weeks)

**Goal**: Functional carpooling with real authentication and data persistence

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Supabase integration | P0 | 3 days | Database, auth setup |
| Email + Google OAuth | P0 | 2 days | Replace mock login |
| User profile CRUD | P0 | 2 days | Save/update profile |
| Post CRUD | P0 | 3 days | Create/read/update/delete posts |
| Real filtering | P0 | 2 days | Database queries |
| Basic matching | P1 | 3 days | Request to join ride |
| Email notifications | P1 | 2 days | Match requests, confirmations |
| Avatar upload | P2 | 1 day | Supabase Storage |
| Bug fixes & polish | P1 | 3 days | Known issues |

**MVP Total**: ~3-4 weeks development

### Phase 2: Enhanced Features (4-6 weeks)

| Feature | Priority | Notes |
|---------|----------|-------|
| Real-time updates | P1 | Supabase Realtime for live post updates |
| In-app messaging | P1 | Chat between matched users |
| Push notifications | P2 | Match alerts, ride reminders |
| Ride history | P2 | Past rides, recurring patterns |
| Review/rating system | P2 | Build trust in community |
| Advanced search | P2 | Geospatial queries, time-based matching |
| Schedule flexibility | P2 | Date ranges, one-time vs recurring |

### Phase 3: Growth Features (6-8 weeks)

| Feature | Priority | Notes |
|---------|----------|-------|
| Smart matching algorithm | P1 | ML-based route/schedule optimization |
| Holiday travel mode | P1 | Airport rides, one-time trips |
| Group rides | P2 | Multiple passengers per ride |
| Payment integration | P2 | Venmo/PayPal/Stripe for cost splitting |
| Mobile app (React Native) | P2 | Native iOS/Android experience |
| UCI SSO integration | P3 | Single sign-on with UCI credentials |
| Admin dashboard | P3 | Moderation, analytics, support |

### Phase 4: Scale & Monetization (Ongoing)

| Feature | Notes |
|---------|-------|
| Premium features | Priority matching, verified badges |
| Partnership with UCI Transportation | Official endorsement, integration |
| Expansion to other UC campuses | UC San Diego, UCLA, UC Berkeley |
| Carbon offset tracking | Environmental impact dashboard |
| Insurance/liability integration | Safety compliance |

---

## 7. Backend API Specification

### Authentication Endpoints

Using Supabase Auth (or equivalent), the following flows are supported:

```
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/oauth/google
POST /auth/reset-password
GET  /auth/user
```

### REST API Endpoints

#### Users/Profiles

```
GET    /api/profiles/:id          # Get user profile
PUT    /api/profiles/:id          # Update own profile
POST   /api/profiles/:id/avatar   # Upload avatar
```

#### Posts

```
GET    /api/posts                 # List posts (with filters)
GET    /api/posts/:id             # Get single post
POST   /api/posts                 # Create post
PUT    /api/posts/:id             # Update own post
DELETE /api/posts/:id             # Delete own post
GET    /api/posts/my              # Get current user's posts
```

**Query Parameters for GET /api/posts:**
- `type`: 'driver' | 'passenger' | 'all'
- `city`: string (fuzzy search on origin)
- `day`: string (filter by specific day)
- `time_start`: string (HH:MM)
- `time_end`: string (HH:MM)
- `limit`: number (default 20)
- `offset`: number (pagination)

#### Matches

```
GET    /api/matches               # Get user's matches (sent & received)
POST   /api/matches               # Request to match with a post
PUT    /api/matches/:id           # Accept/reject match
DELETE /api/matches/:id           # Cancel match request
```

#### Messages (Optional)

```
GET    /api/conversations                    # List conversations
GET    /api/conversations/:id/messages       # Get messages in conversation
POST   /api/conversations/:id/messages       # Send message
```

### Realtime Subscriptions (Supabase)

```javascript
// Subscribe to new posts
supabase
  .channel('posts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, handler)
  .subscribe();

// Subscribe to match updates
supabase
  .channel('matches')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `requester_id=eq.${userId}` }, handler)
  .subscribe();
```

---

## 8. Security Considerations

### Authentication & Authorization

| Concern | Mitigation |
|---------|------------|
| Email verification | Required @uci.edu domain + email verification |
| Session management | Supabase JWT with short expiry, refresh tokens |
| OAuth security | Google OAuth for verified student emails |
| Password security | Minimum 8 chars, bcrypt hashing (Supabase default) |

### Data Protection

| Concern | Mitigation |
|---------|------------|
| PII exposure | Only show necessary info (name, major, socials user opted in) |
| Phone/email privacy | Only visible to matched users |
| Location privacy | Show city-level only until matched |
| SQL injection | Parameterized queries (Supabase handles this) |
| XSS prevention | React's built-in escaping, avoid raw HTML insertion |

### Row-Level Security (RLS)

```sql
-- Users can only see active posts
-- Users can only edit/delete their own posts
-- Match requests are only visible to involved parties
-- Messages are only visible to conversation participants
```

### Rate Limiting

| Action | Limit |
|--------|-------|
| Login attempts | 5 per minute |
| Post creation | 10 per day |
| Match requests | 20 per day |
| API calls | 100 per minute |

### Safety Features (Future)

- Report user/post functionality
- Block user capability
- Admin moderation queue
- Verified driver badges (license check)
- Emergency contact feature
- Trip sharing with trusted contacts

---

## 9. UI/UX Design System

### Brand Colors

```css
:root {
  /* UCI Official Colors */
  --uci-blue: #0064A4;
  --uci-gold: #FFD200;
  --uci-dark: #1B3D6D;
  --uci-light: #4aa0e0;

  /* Extended Palette */
  --success: #10B981;  /* Emerald 500 */
  --warning: #F59E0B;  /* Amber 500 */
  --error: #EF4444;    /* Red 500 */
  --info: #3B82F6;     /* Blue 500 */
}
```

### Typography

```css
/* Headings */
font-family: 'Plus Jakarta Sans', sans-serif;
font-weight: 700-800;

/* Body */
font-family: 'Inter', sans-serif;
font-weight: 400-600;
```

### Component Patterns

#### Glass Morphism Cards
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  border-radius: 1.5rem; /* 24px */
}
```

#### Button Styles
```css
/* Primary */
.btn-primary {
  @apply bg-uci-blue text-white px-6 py-3 rounded-xl font-bold;
  @apply hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25;
}

/* Secondary */
.btn-secondary {
  @apply bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold;
  @apply hover:bg-slate-200 transition-colors;
}

/* Gold CTA */
.btn-gold {
  @apply bg-uci-gold text-uci-dark px-6 py-3 rounded-xl font-bold;
  @apply hover:shadow-lg shadow-yellow-400/30;
}
```

#### Form Inputs
```css
.input {
  @apply w-full p-4 bg-slate-50 border border-slate-200 rounded-xl;
  @apply font-medium outline-none transition-all;
  @apply focus:ring-2 focus:ring-uci-blue/20 focus:border-uci-blue focus:bg-white;
}
```

### Animation Guidelines

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Fade in up | 0.5s | ease-out | Page load |
| Hover scale | 0.3s | ease-in-out | Buttons, cards |
| Menu slide | 0.2s | ease-in-out | Dropdowns, mobile menu |
| Loading spin | 1s | linear | Spinners |

### Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 10. Testing Strategy

### Unit Testing

```bash
# Recommended tools
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

| Category | Coverage Target | Examples |
|----------|-----------------|----------|
| Utility functions | 90% | Date formatting, validation |
| React hooks | 80% | useAppContext, custom hooks |
| Components | 70% | PostCard, InputField, SelectField |

### Integration Testing

| Flow | Priority |
|------|----------|
| Login -> Onboarding -> Dashboard | P0 |
| Create Post -> View in Browse | P0 |
| Filter Posts | P1 |
| Match Request Flow | P1 |

### E2E Testing (Playwright/Cypress)

```javascript
// Example test scenarios
describe('User Journey', () => {
  it('should complete onboarding flow', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@uci.edu');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/onboarding');
    // ... complete all 5 steps
    cy.url().should('include', '/dashboard');
  });

  it('should create and view a post', () => {
    cy.login(); // Custom command
    cy.visit('/create');
    cy.get('input[name="origin"]').type('Irvine');
    // ... fill form
    cy.get('button[type="submit"]').click();
    cy.visit('/browse');
    cy.contains('Irvine').should('exist');
  });
});
```

### Performance Testing

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle size | < 500KB | webpack-bundle-analyzer |

---

## 11. Deployment Strategy

### Development Environment

```bash
# Local development
npm run dev          # Start Vite dev server on :3000
npm run build        # Production build
npm run preview      # Preview production build
```

### Staging Environment

- **Platform**: Vercel/Netlify (preview deployments)
- **Database**: Supabase staging project
- **URL**: staging.zotpool.com or Vercel preview URLs

### Production Environment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Automatic deploys from main branch |
| Backend | Supabase | Managed PostgreSQL, Auth, Realtime |
| CDN | Vercel Edge | Automatic via Vercel |
| Maps | Mapbox | Production API key |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog/Mixpanel | User behavior |

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Variables

```bash
# .env.local (local development)
VITE_MAPBOX_TOKEN=pk.xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Production (set in Vercel/deployment platform)
VITE_MAPBOX_TOKEN=<production-key>
VITE_SUPABASE_URL=<production-url>
VITE_SUPABASE_ANON_KEY=<production-key>
```

---

## 12. Success Metrics

### Key Performance Indicators (KPIs)

#### User Acquisition
| Metric | MVP Target | 6-Month Target |
|--------|------------|----------------|
| Registered users | 500 | 5,000 |
| Daily active users | 50 | 500 |
| Weekly active users | 200 | 2,000 |

#### Engagement
| Metric | MVP Target | 6-Month Target |
|--------|------------|----------------|
| Posts created per week | 100 | 1,000 |
| Match requests per week | 50 | 500 |
| Successful matches per week | 25 | 250 |
| Return user rate | 30% | 50% |

#### Business
| Metric | MVP Target | 6-Month Target |
|--------|------------|----------------|
| Cost per acquisition | $0 (organic) | < $2 |
| Rides completed | 100/month | 1,000/month |
| Average rides per user | 2/month | 4/month |

### Analytics Implementation

```javascript
// Track key events
analytics.track('user_signed_up', { method: 'email' | 'google' });
analytics.track('onboarding_completed', { role: 'driver' | 'passenger' | 'both' });
analytics.track('post_created', { type: 'driver' | 'passenger' });
analytics.track('match_requested', { post_id });
analytics.track('match_accepted', { match_id });
analytics.track('ride_completed', { match_id });
```

### Feedback Collection

- In-app feedback form (accessible from menu)
- NPS survey after 5th ride
- Post-ride rating prompt
- Discord community for feature requests
- Bug reporting integration (Sentry)

---

## 13. Implementation Priorities

### Immediate (This Week)

1. **Extract shared components** - Move InputField, SelectField to `components/`
2. **Fix component duplication** - Single source of truth for UI components
3. **Add form validation** - Client-side validation for all forms
4. **Fix hardcoded values** - Dashboard stats should reflect actual data

### Short-Term (Weeks 1-2)

1. **Supabase setup** - Create project, design schema, enable auth
2. **Auth integration** - Replace mock login with Supabase Auth
3. **Profile persistence** - Save onboarding data to database
4. **Post CRUD** - Connect posts to database

### Medium-Term (Weeks 3-4)

1. **Real filtering** - Database queries for browse
2. **Match system** - Request/accept/reject flows
3. **Notifications** - Email on match events
4. **Profile editing** - Update profile post-onboarding

### Long-Term (Month 2+)

1. **In-app messaging** - Real-time chat
2. **Reviews/ratings** - Trust system
3. **Advanced matching** - Smart suggestions
4. **Mobile optimization** - PWA or React Native

---

## Appendix A: Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Linting (add ESLint)
npm run lint
```

## Appendix B: Environment Setup

### Required Accounts

1. **Supabase** - https://supabase.com (database, auth)
2. **Mapbox** - https://mapbox.com (maps, geocoding)
3. **Vercel** - https://vercel.com (hosting)
4. **GitHub** - Repository hosting

### Local Setup

```bash
# Clone repository
git clone https://github.com/your-org/zotpool.git
cd zotpool

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your keys to .env.local
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development
npm run dev
```

## Appendix C: Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [UCI Brand Guidelines](https://brand.uci.edu)

---

**Document maintained by**: ZotPool Development Team
**Questions?**: Create an issue in the repository

# ZotPool v2 - Product Requirements Document

## Context

ZotPool is a carpooling platform originally built for UCI students, being remade for Irvine Hacks. The current app is a React 19 + TypeScript + Vite SPA using Supabase (auth/DB) and Mapbox (maps). It currently restricts access to `@uci.edu` emails only and supports basic ride post creation, browsing, and profile management.

The remake is a **ground-up rewrite** with a clean project structure (proper `src/` directory, installed Tailwind, etc.), reusing design patterns but building fresh components. The platform expands to serve all users (not just UCI) while keeping UCI SSO as the trust backbone, adds intelligent matching, safety features, and ride categorization. Timeline is 1 week+, so all priority tiers (P0/P1/P2) are achievable.

The core pitch: "This turns a lonely 20-minute crawl on Culver Blvd into a networking session with someone in your same CS lab."

---

## 1. Product Vision

### Problem

36,000+ UCI students and thousands of staff commute daily from across SoCal. They face $5+/gallon gas, $900+/year parking permits, I-405 gridlock, and solo-driving isolation. Existing solutions (GroupMe, Reddit, Facebook groups) are fragmented, unverified, and lack structured matching or safety.

### Solution

ZotPool matches UCI commuters (and nearby general users) with verified carpools based on route, schedule, and preferences -- with safety, sustainability, and community at its core.

### Target Audience

- **Primary**: UCI community (students, staff, employees) with `@uci.edu` emails
- **Secondary**: Non-UCI users traveling to/from the UCI area (within 400 miles)
- **Tertiary**: Non-UCI users traveling between non-UCI areas (both start and end points must be within 400 miles of UCI)

### Key Value Props

| For | Value |
|-----|-------|
| Drivers | Fill empty seats, offset gas/parking costs |
| Passengers | Affordable rides without needing a car or parking permit |
| Safety-conscious | UCI SSO verification, gender preferences, vehicle ID, waiver |
| UCI community | Reduced traffic, fewer parking demands, sustainability |

---

## 2. User Personas

### Sofia - Budget-Conscious Undergrad Passenger

- Sophomore, Biology, lives in Fullerton (25 min drive)
- TTh classes 9 AM - 3:30 PM, recurring weekly
- Cannot afford parking permit. OCTA transit takes 90+ minutes
- Wants: Same-gender driver from Fullerton/Anaheim area, transparent cost-splitting
- Uses: Gender preference, commute type, payment calculator, zone pickup

### Marcus - Daily Driver Offsetting Costs

- Junior, Mechanical Engineering, lives in Long Beach (40 min), owns Honda Civic
- MWF + some TTh, drives daily regardless
- Spends $200+/month on gas, 3 empty seats daily
- Wants: Fill seats with verified UCI riders, split gas/parking
- Uses: Vehicle ID, parking zone (Lot 5), cost sharing, commute type

### Priya - Safety-Focused Graduate Student

- First-year PhD, new to California, no car, lives near Spectrum
- Irregular schedule, lab hours vary, sometimes late nights
- Wants: Same-gender only, verified UCI members, vehicle details before accepting
- Uses: Gender preference, vehicle ID, waiver, notifications, event-type rides

### David - Flexible Staff Member

- UCI IT staff, 10 years, lives in Tustin, Tesla Model 3
- Regular M-F 8-5, drives daily
- Wants to contribute to sustainability, sometimes needs rides when car is in shop
- Uses: Both-role, commute type, Ride to Event for airport trips

---

## 3. Access Tiers

### Tier 1: UCI Verified (`@uci.edu`)

- **Auth (primary)**: Google OAuth with `hd: 'uci.edu'` hint (existing)
- Full access: create posts, browse all UCI rides, route matching, parking zones
- Displays "UCI Verified" badge (shield icon) on profile and cards
- Can restrict their rides to UCI-only users

### Tier 2: General Users (any email)

- **Auth (secondary)**: Email + password signup with email verification
  - User enters email + password to create account
  - Supabase sends a 6-digit OTP code to their email (`signInWithOtp` with `type: 'email'`)
  - User enters the code to verify their email and complete registration
  - Subsequent logins use email + password (`signInWithPassword`)
- Can create posts and browse, but cannot see rides marked "UCI Only"
- No parking zone features (campus-specific)
- Displays "Community" badge
- UCI users can filter them out

### Geographic Restriction (Both Tiers)

- Both ride start AND end points must be within 400 miles of UCI (33.6405, -117.8443)
- Validated via Haversine formula after geocoding
- Client-side: immediate inline feedback during address entry
- Server-side: hard gate before DB insert
- **User-facing error message should be vague** -- do NOT expose the 400-mile logic to users. Use something like: "This location is outside our service area" or "Your start point or end point is too far"
- Covers SoCal, Central Valley, Las Vegas, Phoenix, parts of NorCal

---

## 4. Ride Type System

### Commute (Recurring)

- Weekly schedule: multi-select days (Mon-Sun), departure/return times
- Automatically recurring until deactivated
- Matching prioritizes overlapping days + time windows
- Card display: "MWF, 8:00 AM - 5:00 PM" with repeat icon
- Color accent: UCI Blue

### Ride to Event (One-time)

- Specific date via date picker, departure time, optional return
- Non-recurring, expires after ride date
- Category tags: Airport, Going Home, Campus Event, Off-Campus Event, Other
- Card display: "Feb 28, 2026, 6:00 AM" with calendar icon
- Color accent: Teal/Emerald

---

## 5. Core Features

### F1: UCI SSO / Two-Tier Auth [P0]

- **Primary (UCI)**: Google OAuth with `hd: 'uci.edu'` hint -- single-click sign in
- **Secondary (General)**: Email + password signup with email verification via 6-digit OTP code
  - Signup: `supabase.auth.signUp({ email, password })` -- Supabase auto-sends confirmation email with OTP code
  - User enters 6-digit code from email to verify (`supabase.auth.verifyOtp({ email, token, type: 'email' })`)
  - Login: `supabase.auth.signInWithPassword({ email, password })` (only works after email is verified)
- Remove current UCI-only restriction in `validateUciEmail` -- allow any email for general tier
- Set `auth_tier: 'uci' | 'general'` on user profile at signup based on email domain
- UCI badge vs Community badge displayed everywhere
- **No magic links** -- removed in favor of email + password with OTP verification

**User Stories:**

- As a UCI student, I sign in with my UCI Google account so my identity is verified
- As a non-UCI user, I sign up with my email and password, verify via a code sent to my email, then log in
- As a UCI user, I can restrict my ride to UCI-verified users only

### F2: Waiver System [P0]

- All users must sign a digital liability waiver before platform use
- Presented as step 2 in onboarding (or standalone `/waiver` page)
- Content: liability disclaimer, community guidelines, data consent
- User scrolls through content, checks "I agree", types name as signature
- Stores `waiver_signed_at` + `waiver_version` on user record
- `ProtectedRoute` redirects to `/waiver` if unsigned
- Re-signing required when waiver version updates

**User Stories:**

- As a new user, I review and sign the waiver during onboarding before using the platform
- As a returning user, I can see when I signed the waiver from my profile

### F3: Ride Type Categorization [P0]

- Top-level selector on CreatePost: "Commute" vs "Ride to Event"
- Commute: existing day-of-week + time UI (auto-recurring)
- Event: date picker + time + category tag dropdown
- Browse filter for ride type
- Cards visually distinguish types (different icons, color accents)
- `Post` gains `rideType: 'commute' | 'event'` and optional `eventDate`, `eventTag`

**User Stories:**

- As a daily commuter, I post a recurring weekly schedule
- As a student going home for break, I post a one-time ride to LAX on a specific date
- As a browser, I filter between commute and event rides

### F4: Route Matching Algorithm [P0]

- User inputs start, end, time window, day(s) -> backend returns ranked matches
- Scoring formula (0-100):
  - Route proximity (40%): straight-line distance between origins + destinations (Turf.js)
  - Time overlap (25%): departure window compatibility
  - Day overlap (20%): matching scheduled days
  - Preferences (15%): gender compatibility, cost acceptability
- Hard filters: gender preference violations = no match, 0 day overlap = no match
- Results sorted by composite score with quality indicator ("95% match", "Good fit")
- Triggers: on ride creation, on manual "Find Matches" request

**Hackathon simplification:** Run matching client-side in `services/matching.ts`. Use straight-line distance between origins (< 5 miles = match candidate) rather than Mapbox Directions API calls for every pair.

**User Stories:**

- As a passenger, I input my location and schedule and see ranked driver matches
- As a driver, I get notified when a new passenger's route overlaps with mine

### F5: Parking Zone Specification [P1]

- UCI zones 1-6 with color-coded visual picker
- Zone colors: 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Blue, 6=Purple
- Two-part component: stylized campus diagram (SVG) + zone list with color dots
- Available to UCI-verified users only
- Shown in CreatePost when destination is UCI, as badge on Browse cards
- Browse filter: compact color-dot checkboxes for zone filtering
- Hardcode zone GeoJSON in `data/parkingZones.ts` for hackathon

**User Stories:**

- As a driver who parks in Lot 5, I indicate Zone 5 so nearby riders can find me
- As a passenger, I filter by parking zone to find drivers who park near my classes

### F6: Vehicle Identification [P0]

- Structured fields: make, model, year, color, license plate
- Stored per-user in `vehicles` table (drivers can have one default vehicle)
- Entered during onboarding (step 6 if role = driver/both) and editable from profile
- Auto-populated in CreatePost from profile, editable per-ride
- License plate partially masked in browse (last 3-4 chars), full plate visible to matched riders
- Browse cards show "Silver 2019 Honda Civic" with car icon

**User Stories:**

- As a passenger, I see the driver's car details so I can identify the right vehicle at pickup
- As a driver, I enter vehicle details once and they auto-fill on new posts

### F7: Gender Preference [P0]

- Expanded options: "No preference" | "Same gender" | "Women and non-binary only" | "Men only"
- Available to BOTH drivers AND passengers (currently passenger-only)
- Matching algorithm respects preferences as hard filters
- Posts with restrictions visually marked (shield icon + label)
- Browse filter for gender preference

**User Stories:**

- As a female student, I specify women-only drivers for safety
- As a driver, I set my ride open to any gender for maximum matches

### F8: Notifications [P1]

- **In-app**: Bell icon in navbar with unread count badge. Dropdown on desktop, full page on mobile
- **Email**: Via Supabase Edge Functions + Resend (or Supabase built-in email)
- Notification types: match request, match accepted/declined, pickup reminder, ride cancelled
- Supabase Realtime subscription for live delivery
- Notification preferences page (toggle on/off per type)
- `notifications` table: id, user_id, type, title, body, data (JSONB), is_read, email_sent

**User Stories:**

- As a passenger with a confirmed ride, I get a notification 30 min before pickup
- As a driver, I get notified when someone sends a match request

### F9: Suggested Payment [P1]

- Auto-calculated based on: `(distance_miles * 2 / avg_mpg * gas_price) / total_riders`
- Defaults: avg_mpg = 28, gas_price = $4.50/gal (SoCal avg), parking = $14/day
- Shown on CreatePost after route is calculated, on ride cards in Browse, in match details
- Drivers can override with their own amount
- Display: "Suggested: ~$X.XX per rider" with breakdown tooltip

**User Stories:**

- As a driver, I see a fair suggested price when creating my post
- As a passenger, I see the estimated cost before requesting a match

### F10: Matching Ecosystem (Full Flow) [P0]

- End-to-end: user inputs ride needs -> system finds matches -> connects driver and rider
- "Find a Match" entry on Dashboard
- Match request: user sends request to a specific ride -> creates `matches` record
- Post owner gets notification, can accept or reject
- On acceptance: both parties see full profile + contact info + vehicle details
- Match statuses: pending -> accepted -> active -> completed/cancelled
- Active matches appear in Dashboard "My Rides" section
- `matches` table: id, driver_ride_id, passenger_ride_id, score, status, requested_by

**User Stories:**

- As a new user, I input my needs and immediately see available matches
- As a matched rider, I see the driver's vehicle details and contact info after acceptance

### F11: 400-Mile Geographic Restriction [P0]

- Both origin AND destination validated at ride creation
- Uses Haversine formula with UCI coordinates and 400-mile radius
- Client-side: after geocoding, inline error (no distance numbers exposed)
- Server-side: Edge Function validates before DB insert
- Visual feedback: green checkmark when valid, red border + "This location is outside our service area" when invalid
- The 400-mile threshold is internal logic only -- never shown to users

---

## 6. Database Schema Changes

### Modified: `users` table

```
+ auth_tier TEXT ('uci' | 'general')
+ waiver_signed_at TIMESTAMPTZ
+ waiver_version TEXT
+ home_lat DOUBLE PRECISION
+ home_lng DOUBLE PRECISION
+ notification_preferences JSONB
```

### Renamed: `posts` -> `rides`

```
+ ride_category TEXT ('commute' | 'event')
+ origin_lat DOUBLE PRECISION (geocoded)
+ origin_lng DOUBLE PRECISION (geocoded)
+ destination_lat DOUBLE PRECISION (geocoded)
+ destination_lng DOUBLE PRECISION (geocoded)
+ destination_parking_zone INT (1-6)
+ vehicle_id UUID -> vehicles(id)
+ event_date DATE (for event rides)
+ event_tag TEXT (airport, going_home, etc.)
+ route_distance_miles DOUBLE PRECISION (cached)
+ suggested_cost_cents INT (cached)
+ uci_only BOOLEAN (restrict to UCI users)
+ status TEXT (active, filled, expired, cancelled)
```

### New: `vehicles`

```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  color TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### New: `matches`

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  passenger_ride_id UUID REFERENCES rides(id) ON DELETE CASCADE NOT NULL,
  score INT DEFAULT 0,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  requested_by UUID REFERENCES auth.users(id) NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### New: `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('match_request', 'match_accepted', 'match_declined',
                    'pickup_reminder', 'ride_cancelled')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### New: `waivers`

```sql
CREATE TABLE waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Page Map

### Modified Pages

| Page | Route | Key Changes |
|------|-------|-------------|
| Landing | `/` | Dual CTA for UCI + general users, updated copy |
| Login | `/login` | Keep as-is for UCI auth |
| SignUp | `/signup` | Add branch: "UCI email" vs "Any email" |
| Onboarding | `/onboarding` | Expand 5 -> 7 steps: add waiver (step 2), vehicle details (step 6), parking zone prefs (step 7) |
| Dashboard | `/dashboard` | Add notification bell, "Your Matches" section, tier badge |
| Browse | `/browse` | Add filters: ride type, tier, parking zone, gender, cost, day. Add payment/tier badges on cards |
| CreatePost | `/create` | Add ride type selector, parking zone picker, vehicle pre-fill, payment calc, 400-mile validation |
| Profile | `/profile` | Add tier badge, vehicle section, waiver status, match history |

### New Pages

| Page | Route | Purpose |
|------|-------|---------|
| Waiver | `/waiver` | Digital waiver review + signature |
| Matches | `/matches` | Match results: pending, accepted, past |
| Match Detail | `/matches/:id` | Single match with route map, schedule overlap, payment, accept/decline |
| Notifications | `/notifications` | Full notification history grouped by date |
| Settings | `/settings` | Notification preferences, privacy, waiver, account |
| Ride Detail | `/ride/:id` | Shareable ride page (replaces Browse modal for full view) |

---

## 8. Key User Flows

### UCI User: Signup to Ride Day

1. Landing -> "UCI Student? Start Here"
2. SignUp -> Google OAuth with `hd: 'uci.edu'`
3. Waiver -> Read, agree, sign
4. Onboarding (7 steps) -> Name/Gender, City (400mi validation), Studies, Socials, Role, Vehicle (if driver), Parking Zone (if UCI)
5. Dashboard -> "I have a car" or "I need a ride"
6. CreatePost -> Select ride type, fill route/schedule/details, see payment suggestion
7. System runs matching -> notification appears
8. Matches page -> review, accept/decline
9. Ride day -> dashboard shows upcoming ride with driver/rider info

### General User: Signup to Ride Day

1. Landing -> "Not UCI? Join Too"
2. SignUp -> Enter email + password -> receive 6-digit OTP code via email -> enter code to verify
3. Waiver -> Same flow
4. Onboarding (6 steps, no parking zone)
5. Browse -> filtered to general rides (cannot see UCI-only posts)
6. Request match -> driver reviews -> accept/decline
7. Ride day -> same from here

### Driver: Post to Ride Day

1. Dashboard -> "I have a car"
2. CreatePost -> Commute or Event, route, schedule, vehicle (pre-filled), cost type, payment suggestion
3. Wait for match notifications
4. Review requests in /matches -> see rider profile, route overlap, detour time
5. Accept -> both parties see contact info
6. Ride day -> rider info, pickup details, route

---

## 9. New Components to Build

| Component | File | Purpose |
|-----------|------|---------|
| ParkingZonePicker | `components/ParkingZonePicker.tsx` | SVG campus diagram + zone list, color-coded |
| NotificationBell | `components/NotificationBell.tsx` | Navbar bell icon with dropdown + unread count |
| NotificationItem | `components/NotificationItem.tsx` | Individual notification with icon, title, time |
| MatchCard | `components/MatchCard.tsx` | Match result with score, route, schedule, actions |
| PaymentSuggestionCard | `components/PaymentSuggestionCard.tsx` | Cost breakdown display |
| VehicleDetailsForm | `components/VehicleDetailsForm.tsx` | Make/model/year/color/plate form |
| TierBadge | `components/TierBadge.tsx` | UCI Verified shield or Community badge |
| RideTypePicker | `components/RideTypePicker.tsx` | Commute vs Event toggle |
| LocationInput | `components/LocationInput.tsx` | Geocoded input with 400-mile validation |
| ToggleSwitch | `components/ToggleSwitch.tsx` | Settings toggle component |
| WaiverContent | `components/WaiverContent.tsx` | Waiver text + agreement UI |

---

## 10. Design Direction

### Preserve from Current App

- **Color theme**: Keep UCI brand colors (uci-blue `#0064A4`, uci-gold `#FFD200`, uci-dark `#1B3D6D`, uci-light `#4aa0e0`) and slate neutrals
- **Hero/Landing section**: Keep the current hero layout and mesh gradient background, but make the yellow radial gradient slightly smaller (reduce its spread from `transparent 50%` to roughly `transparent 40%`)
- **Font families**: Keep Plus Jakarta Sans (display) and Inter (body)

### Complete Rewrite for All Other Components

All non-hero UI (dashboard, browse, create post, profile, onboarding, matches, notifications, settings, cards, forms, modals, navigation) should be designed from scratch using these two Claude Code skills for guidance:

- **`/frontend-design`** -- for distinctive, production-grade interfaces that avoid generic AI aesthetics
- **`/design-taste-frontend`** -- for high-agency frontend engineering with calibrated design variance, motion, and visual density

The implementer should invoke both skills at the start of the session and follow their principles for all new component design.

---

## 11. Tech Stack and Project Structure

### Ground-Up Rewrite Structure

```
src/
  components/        # Shared UI components (TierBadge, MatchCard, etc.)
  pages/             # Route-level page components
  context/           # React contexts (AuthContext, RideContext, NotificationContext)
  services/          # Supabase client, matching algorithm, payment calc
  hooks/             # Custom React hooks
  types/             # TypeScript interfaces and types
  data/              # Static data (parking zones GeoJSON, waiver text)
  lib/               # Utility functions (geo validation, date helpers)
  assets/            # Static assets (SVGs, images)
  App.tsx
  main.tsx
  index.css
tailwind.config.ts
vite.config.ts
index.html
```

### Stack

- React 19, TypeScript, Vite 6, Supabase, Mapbox GL, react-router-dom, lucide-react
- **Tailwind CSS installed properly** (not CDN) with `tailwindcss` + `@tailwindcss/vite`
- **BrowserRouter** instead of HashRouter (cleaner URLs)
- `@turf/distance` for Haversine distance (400-mile validation and matching proximity)
- `date-fns` for date/time manipulation (schedule overlap calculations)
- Supabase Edge Functions (Deno) for server-side matching, payment calc, notifications
- Supabase Realtime for live notification delivery
- Resend (or Supabase email) for transactional email notifications

### Split AppContext into Multiple Contexts

- `AuthContext` - Auth state, login/logout, tier management
- `RideContext` - Rides CRUD, matching
- `NotificationContext` - Notification state, Realtime subscriptions

### Skip

- No state management library beyond React Context
- No testing framework
- No PWA/service worker
- No ORM

---

## 12. TypeScript Types

### Type Aliases

```typescript
type AuthTier = 'uci' | 'general';
type UserRole = 'driver' | 'passenger' | 'both';
type RideCategory = 'commute' | 'event';
type EventTag = 'airport' | 'going_home' | 'campus_event' | 'off_campus_event' | 'other';
type GenderPreference = 'no_preference' | 'same_gender' | 'women_and_nb' | 'men_only';
type CostType = 'free' | 'split_gas' | 'split_gas_parking' | 'negotiable';
type CarCleanliness = 1 | 2 | 3 | 4 | 5;
type ParkingZone = 1 | 2 | 3 | 4 | 5 | 6;
type MatchStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
type RideStatus = 'active' | 'filled' | 'expired' | 'cancelled';
type NotificationType = 'match_request' | 'match_accepted' | 'match_declined'
                      | 'pickup_reminder' | 'ride_cancelled';
```

### Core Interfaces

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  authTier: AuthTier;
  avatar?: string;
  gender?: string;
  pronouns?: string;
  city?: string;
  major?: string;
  year?: string;
  socials?: { instagram?: string; discord?: string; phone?: string };
  role?: UserRole;
  isOnboarded: boolean;
  waiverSignedAt?: string;
  waiverVersion?: string;
  homeLat?: number;
  homeLng?: number;
  notificationPreferences?: NotificationPreferences;
}

interface NotificationPreferences {
  matchRequest: boolean;
  matchAccepted: boolean;
  matchDeclined: boolean;
  pickupReminder: boolean;
  rideCancelled: boolean;
  emailEnabled: boolean;
}

interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  isDefault: boolean;
  createdAt: string;
}

interface Ride {
  id: string;
  userId: string;
  user: User;
  type: 'driver' | 'passenger';
  rideCategory: RideCategory;
  origin: string;
  originLat?: number;
  originLng?: number;
  destination: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationParkingZone?: ParkingZone;
  schedule: {
    days: string[];
    timeStart: string;
    timeEnd: string;
    isRecurring: boolean;
  };
  eventDate?: string;
  eventTag?: EventTag;
  details: {
    vehicleId?: string;
    vehicle?: Vehicle;
    seats?: number;
    cleanliness?: CarCleanliness;
    yearsDriving?: number;
    genderPreference?: GenderPreference;
    costType?: CostType;
    notes?: string;
  };
  routeDistanceMiles?: number;
  suggestedCostCents?: number;
  uciOnly: boolean;
  status: RideStatus;
  createdAt: string;
}

interface Match {
  id: string;
  driverRideId: string;
  driverRide?: Ride;
  passengerRideId: string;
  passengerRide?: Ride;
  score: number;
  status: MatchStatus;
  requestedBy: string;
  respondedAt?: string;
  createdAt: string;
}

interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
}

interface Waiver {
  id: string;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

interface MatchScore {
  total: number;
  routeProximity: number;
  timeOverlap: number;
  dayOverlap: number;
  preferences: number;
}
```

---

## 13. Matching Algorithm Specification

### Input

A user's ride (origin, destination, schedule, preferences) and the pool of all active rides.

### Scoring Formula (0-100)

| Factor | Weight | Calculation |
|--------|--------|-------------|
| Route proximity | 40% | Haversine distance between origins + destinations. <1mi = 40, <3mi = 30, <5mi = 20, <10mi = 10, >10mi = 0 |
| Time overlap | 25% | Minutes of departure window overlap, proportional to max possible overlap |
| Day overlap | 20% | Matching scheduled days as fraction of total. All days = 20, proportional for partial |
| Preferences | 15% | Gender compatibility + cost acceptability. Full compat = 15, partial = 10, none = 0 |

### Hard Filters (Immediate Disqualification)

- Same ride type (driver-driver or passenger-passenger)
- Gender preference violation (e.g., women-only ride and male user)
- Zero day overlap for commute rides
- Origin points more than 5 miles apart

### Quality Labels

- Score >= 80: "Excellent match"
- Score >= 60: "Good fit"
- Score < 60: "Possible match"

### Implementation Note

For hackathon: run client-side in `services/matching.ts` using straight-line (Haversine) distance rather than routing API calls for every pair.

---

## 14. Payment Calculator Specification

### Formula

```
suggested_per_rider = (distance_miles * 2 / avg_mpg * gas_price + parking_cost) / total_riders
```

### Defaults

| Parameter | Default | Source |
|-----------|---------|--------|
| avg_mpg | 28 | US average for passenger cars |
| gas_price | $4.50/gal | SoCal average (2025-2026) |
| parking_cost | $14.00/day | UCI daily parking rate |

### Display

- Shown on CreatePost after route is calculated
- Shown on ride cards in Browse
- Shown in match detail views
- Drivers can override with their own amount
- Format: "Suggested: ~$X.XX per rider" with expandable breakdown

---

## 15. Priority and Sequencing

With a 1-week+ timeline, all priority tiers are achievable. Build in this order:

### Phase 1: Foundation (Days 1-2)

1. **Project scaffolding** - New `src/` structure, proper Tailwind, BrowserRouter, split contexts
2. **Database migration** - New/modified Supabase tables (rides, vehicles, matches, notifications, waivers)
3. **Two-tier auth** - UCI SSO + general email signup, `auth_tier` field, TierBadge component
4. **Core types** - Full TypeScript interfaces for all new data models

### Phase 2: Core Features (Days 3-4)

5. **Waiver system** - Waiver page + onboarding integration + route guard
6. **Ride type categorization** - Commute vs Event in CreatePost + Browse
7. **Vehicle identification** - VehicleDetailsForm, profile storage, auto-fill in CreatePost
8. **Gender preference expansion** - Both roles, expanded options, matching filter
9. **400-mile geographic restriction** - LocationInput with geocoded validation

### Phase 3: Matching and Intelligence (Days 5-6)

10. **Matching ecosystem** - Matches table, request/accept flow, MatchCard, Matches page
11. **Route matching algorithm** - Scoring logic, ranked results, match quality display
12. **Suggested payment calculator** - Formula + PaymentSuggestionCard display
13. **Parking zone specification** - ParkingZonePicker component + Browse filter

### Phase 4: Polish and Communication (Day 7+)

14. **Notifications** - Bell UI, Realtime subscription, email via Edge Functions
15. **Notification center** - Full /notifications page, Settings preferences
16. **Ride detail shareable page** - /ride/:id replacing Browse modal
17. **Trust indicator badges** - Full badge system on cards
18. **Landing page refresh** - Updated copy, dual CTA, sustainability messaging

---

## 16. Verification Plan

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Sign up with UCI email | UCI Verified badge, full access |
| 2 | Sign up with non-UCI email | Community badge, cannot see UCI-only rides |
| 3 | Skip waiver | Redirected to /waiver before any other page |
| 4 | Complete onboarding as driver | Vehicle details step shown, parking zone step (if UCI) |
| 5 | Create commute ride | Days/time selectors, recurring toggle, ride saved |
| 6 | Create event ride | Date picker, event tag, ride saved |
| 7 | Enter address > 400mi from UCI | "Outside our service area" error, no distance shown |
| 8 | Enter local SoCal address | Green checkmark, address accepted |
| 9 | Set "women only" gender preference | Male users cannot see or match with this ride |
| 10 | Create overlapping driver + passenger rides | Matching algorithm finds them, score displayed |
| 11 | Send match request | Notification sent to ride owner, match status = pending |
| 12 | Accept match | Both parties see contact info + vehicle details |
| 13 | Check suggested payment | Reasonable $ amount based on distance |
| 14 | Select parking zone in CreatePost | Zone badge appears on Browse card |
| 15 | Filter Browse by ride type, tier, zone | Results update correctly |

---

## 17. Open Questions and Future Considerations

### Deferred (Post-Hackathon)

- Real-time chat between matched riders
- Ride completion confirmation and rating system
- Recurring match auto-renewal
- Multi-stop routes (pickup multiple passengers along the way)
- Integration with UCI class schedule API for auto-schedule detection
- Native mobile app (React Native or Flutter)

### Security Considerations

- Rate limiting on auth endpoints
- Row-level security (RLS) on all Supabase tables
- License plate data encryption at rest
- GDPR-style data deletion support
- Abuse reporting mechanism

### Scalability Notes

- Current architecture (client-side matching) works for < 10,000 rides
- Beyond that: move matching to Supabase Edge Function with indexed queries
- Consider PostGIS for geospatial queries if Haversine becomes a bottleneck
- Notification delivery at scale may need a queue (e.g., Supabase pg_cron + Edge Functions)

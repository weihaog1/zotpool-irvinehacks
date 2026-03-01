# ZotPool

UCI carpooling platform - React 19 + TypeScript + Vite 6 + Supabase + Mapbox GL.

## Commands

- `npm run dev` - Start dev server on port 3000
- `npm run build` - Production build to dist/
- `npm run preview` - Preview production build

## Architecture

- **Router**: BrowserRouter
- **State**: AuthContext + RideContext + NotificationContext
- **Styling**: Tailwind via @tailwindcss/vite plugin, config in tailwind.config.ts
- **DB**: Supabase v2 project `pkfhlanvpwqkqkdjzkka` (rides, vehicles, matches, notifications, waivers)
- **Maps**: Mapbox GL via react-map-gl, requires VITE_MAPBOX_TOKEN env var
- **Icons**: lucide-react throughout
- **Aliases**: `@` resolves to `./src` (vite.config.ts + tsconfig.json)

## Project Structure

```
src/
  App.tsx              # Router + ProtectedRoute
  types.ts             # Single source of truth for all TypeScript interfaces
  constants.ts         # Shared constants (DAYS_OF_WEEK, TEST_USER_ID)
  index.tsx, index.css # Entry point + Tailwind base styles
  context/             # AuthContext, RideContext, NotificationContext
  pages/               # Route-level components (11 pages)
  components/
    ui/                # Shared: Layout, RouteMap, SelectField, TierBadge, VehicleDetailsForm, RideCategoryPicker
    auth/              # GoogleIcon, PasswordField
    browse/            # BrowseRideCard, BrowseRideModal, BrowseFilters
    matches/           # MatchCard, FindMatchResults
    profile/           # ProfileEditModal, ProfileSidebarCards
    create-post/       # CreatePostDriverFields, CreatePostScheduleFields, PaymentSuggestionCard
    onboarding/        # OnboardingSteps
    notifications/     # NotificationBell
  services/            # supabase.ts, matching.ts, matches.ts, vehicles.ts, payment.ts, mockData.ts
  lib/                 # geo.ts, formatters.ts (formatTime, formatCostType, formatRelativeTime)
  hooks/               # useClickOutside
  data/                # waiverContent.ts
```

## Key Patterns

- DB uses snake_case, app uses camelCase - conversion functions in services/supabase.ts
- Test user ID defined as TEST_USER_ID in constants.ts, bypasses Supabase writes
- ProtectedRoute checks auth, waiver, and onboarding status
- Pages are lazy-loaded with React.lazy + Suspense
- Component subdirectories have barrel index.ts files for clean imports
- UCI brand colors: blue #0064A4, gold #FFD200, dark #1B3D6D, light #4aa0e0
- Fonts: Plus Jakarta Sans (display/headings), Inter (body)
- Glass morphism utilities: .glass, .glass-solid, .glass-panel (defined in index.html)

## Supabase

- v1 project (current code): htlrlojkfnickpkscvze
- v2 project (new schema): pkfhlanvpwqkqkdjzkka
- v2 tables: users (expanded), rides (was posts), vehicles, matches, notifications, waivers
- RLS enabled on all v2 tables

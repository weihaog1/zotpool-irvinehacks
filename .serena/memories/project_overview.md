# ZotPool Project Overview

## Purpose
ZotPool is a carpooling platform for UC Irvine students. Users can post ride offers (as drivers) or ride requests (as passengers) and browse/match with other UCI commuters.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom UCI brand colors (`uci-blue`, `uci-gold`, `uci-dark`)
- **Routing**: react-router-dom with HashRouter
- **Icons**: lucide-react
- **State**: React Context (AppContext)
- **Data**: Mock data (no backend yet) - state resets on refresh

## Project Structure
```
/pages/         - Page components (Landing, Login, Dashboard, Browse, etc.)
/components/    - Reusable UI components (Navbar, Footer, PostCard, etc.)
/context/       - React Context (AppContext.tsx)
/services/      - Mock data and services
/types.ts       - TypeScript type definitions
```

## Key Types
- `User` - Profile with role (driver/passenger/both), socials, UCI info
- `Post` - Ride listing with origin/destination, schedule, driver details

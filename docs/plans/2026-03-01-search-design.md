# Search Functionality Design

## Summary

Add a global search bar with city autocomplete and enhanced Browse page filters for schedule and location. All filtering stays client-side. URL query params make searches shareable and bookmarkable.

## Global Search Bar

- Lives in the top nav bar (`Layout.tsx`), visible on all authenticated pages
- Text input with autocomplete dropdown showing matching city names
- Autocomplete source: unique origin cities from already-loaded posts (no extra API call)
- On selection or Enter, navigates to `/browse?q=<city>`
- On mobile: collapses to a search icon, expands to full input on tap
- New `SearchBar` component in `components/`

## Browse Page Filter Enhancements

### Existing Filters (keep as-is)

- **Role type toggle**: All / Drivers / Passengers
- **City text search**: Enhanced to sync with `?q=` URL param from global search bar

### New Filters

- **Schedule days**: 7 pill buttons (Mon-Sun), multi-select. Filters rides that include ANY of the selected days.
- **Time range**: Two time inputs (earliest departure, latest departure). Filters rides whose `timeStart` falls within the specified window.
- **Destination**: Text input for destination city (origin search already exists).

### Filter UX

- Collapsible accordion sections in the sidebar to keep it manageable
- "Clear all filters" button at the bottom of the filter panel
- Active filter count badge on the mobile filter toggle button
- All filter state stored in URL query params (not component state)
- Filters sync bidirectionally: URL params <-> filter UI

## Data Flow

1. All posts fetched once from Supabase on app load (no change to existing query)
2. Browse page reads URL query params on mount, syncs to filter UI state
3. `useMemo` chain applies filters in order: type -> location -> days -> time
4. Global search bar uses `useNavigate` to push `/browse?q=<city>`
5. Browse picks up `?q=` and pre-fills the origin city filter

## URL Query Params Schema

| Param    | Type   | Example              | Description                     |
|----------|--------|----------------------|---------------------------------|
| `q`      | string | `?q=Irvine`          | Origin city search              |
| `dest`   | string | `?dest=UCI`          | Destination city search         |
| `type`   | string | `?type=driver`       | Role filter (driver/passenger)  |
| `days`   | string | `?days=Mon,Wed,Fri`  | Comma-separated schedule days   |
| `from`   | string | `?from=07:00`        | Earliest departure time         |
| `to`     | string | `?to=10:00`          | Latest departure time           |

## Scope Boundaries

### In scope
- Global search bar component with city autocomplete
- Browse sidebar filter additions (days, time range, destination)
- URL param-based filter persistence
- Accordion collapsible filter sections
- Mobile filter badge with active count

### Out of scope
- Server-side Supabase filtering (client-side is sufficient at current scale)
- Cost type / seats / cleanliness filters (can be added later)
- Search history or saved filters
- User profile search
- Full-text search on notes field
- Changes to data model, types, CreatePost, or AppContext

## Files to Create or Modify

| File                          | Action | Description                              |
|-------------------------------|--------|------------------------------------------|
| `components/SearchBar.tsx`    | Create | Global search bar with autocomplete      |
| `components/Layout.tsx`       | Modify | Add SearchBar to nav                     |
| `pages/Browse.tsx`            | Modify | Add new filters, URL param sync, accordion sections |

## Architecture Decision: Client-Side Filtering

All filtering stays client-side via `useMemo`. Rationale:
- University carpooling app with bounded user base (UCI students)
- Posts are lightweight data (no images/blobs in the list query)
- Avoids Supabase query complexity for composite filters
- Can be migrated to server-side later if scale demands it

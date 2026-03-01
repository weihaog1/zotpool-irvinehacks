# Migration: Add `contact_method` to `matches` table

## Context

The Browse page now lets users send interest directly to ride owners. When sending interest, users can optionally indicate how they plan to contact the ride owner (Instagram, Discord, phone, or email). This selection is stored on the match record.

## SQL

Run this against the **v2 project** (`pkfhlanvpwqkqkdjzkka`):

```sql
ALTER TABLE matches ADD COLUMN contact_method TEXT;
```

## Details

- **Column**: `contact_method`
- **Type**: `TEXT`, nullable
- **Default**: `NULL`
- **Valid values**: `'instagram'`, `'discord'`, `'phone'`, `'email'`, or `NULL`
- **Table**: `matches`
- No RLS changes needed — the column inherits existing row-level policies on `matches`.

## Frontend references

- `src/services/supabase.ts` — `DbMatch.contact_method`
- `src/services/matches.ts` — `createMatchRequest()` inserts it
- `src/components/matches/MatchCard.tsx` — displays it on pending match cards

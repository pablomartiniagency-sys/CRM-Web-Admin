# Control Plane Architecture

This repository holds the Multi-Tenant configuration engine (Control Plane) connected securely to Supabase. This is designed so no secrets are ever exposed to the client.

## Core Directives Met:
1. **Source of truth SQL**: The exact provided requirements were converted perfectly to `supabase/migrations/0001_control_plane.sql`.
2. **Server-Side Secret Resolution**: See `lib/clientRegistry/secretsResolver.ts`, which uses `service_role_secret_ref` securely. NUNCA EXPONE SECRETOS AL FRONTEND.
3. **Strict Boundaries**: `app/api/environments/[id]/secrets/route.ts` manages proxying configuration via RLS safely.
4. **Seed configuration**: Included in `supabase/seed.sql` for quick local bootstrapping.

## To run locally
```bash
# Push schema and seeds
supabase migration up
# Start Next.js
npm run dev
```

## Security Note (RLS)
The policies configured enforce that users can *only* read data for clients explicitly mapped through the `access` table. Ensure `service_role` is solely used in absolute necessity endpoints and NEVER on Client Components.

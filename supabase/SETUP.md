# Supabase setup for Reservas Iturrieta

## 1. Run the migration

In the Supabase Dashboard → **SQL Editor**, paste and run:

`supabase/migrations/001_staff_and_bookings.sql`

Or use the Supabase CLI: `supabase db push`

## 2. Auth settings

- **Authentication → Providers → Email**: enable email + password.
- **Authentication → Settings**: disable public sign-up (invite-only staff).

## 3. Create staff users

**Authentication → Users → Add user** (with password):

| Email | Role (set in step 4) |
|-------|----------------------|
| `jon@iturrieta.eus` | `owner` |
| `amaia@iturrieta.eus` | `waiter` |

## 4. Assign roles

After each user is created, the `profiles` row is auto-created with role `waiter`. Set the owner:

```sql
UPDATE public.profiles
SET role = 'owner', full_name = 'Jon Iturrieta', avatar = '👑'
WHERE email = 'jon@iturrieta.eus';

UPDATE public.profiles
SET full_name = 'Amaia (Floor Waiter)', avatar = '🧑‍🍳'
WHERE email = 'amaia@iturrieta.eus';
```

## 5. App environment

Copy `.env.example` to `.env.local` and fill in **Project URL** and **anon** or **publishable** key.

Restart `npm run dev` after changing env vars.

## 6. Quick test

1. Homepage → submit a test table request (should insert into `booking_requests`).
2. Open `/admin/login` → sign in as owner → confirm the request in **Reservations CRM**.
3. Sign in as waiter in another browser → **Live Floor** → seat the guest.

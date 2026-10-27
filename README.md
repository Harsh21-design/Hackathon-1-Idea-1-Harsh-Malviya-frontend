# Reservas Iturrieta

Reservation site for **Iturrieta**, a family cider house (sagardotegia) in Aramaio, Álava, Basque Country.

Public homepage plus a staff portal at `/admin` (owner and waiter roles). Guest table requests are stored in **Supabase** when configured.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, PostgreSQL, Realtime)

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase (staff login + bookings)

1. Copy `.env.example` to `.env.local` and add your project URL and anon key.
2. Run the SQL migration and create staff users — see [supabase/SETUP.md](supabase/SETUP.md).
3. Staff sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

```bash
npm run lint
npm run build
```

## What is on the homepage

- Navbar and **Reserve a Table** (scrolls to Visit Us)
- Hero, Our Story, The Experience, Visit Us
- Published contact details: phone, WhatsApp, email, and the Aramaio address
- Photographs from [iturrieta.eus](https://iturrieta.eus/)

Opening hours, prices, and remaining seats are not listed, because those details still conflict on the official site.

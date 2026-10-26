# Reservas Iturrieta

Reservation site for **Iturrieta**, a family cider house (sagardotegia) in Aramaio, Álava, Basque Country.

This repo currently has the public homepage only. There is no booking form, payment, or database yet. A table request is confirmed only by the cider house.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## Not in this commit

- Booking flow
- Staff or owner tools
- Supabase

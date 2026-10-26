# Step 04 — Branding

Research date: 26 October 2026.

This note is research and planning only. It does not change the homepage, styles, or components. Step 05 (UI) and Step 06 (Flows and Features) have not started.

Labels used below:

- **Verified:** read from the live Iturrieta website or from a file in this repo on 26 October 2026.
- **Proposed:** a design recommendation for our prototype. Not an official brand rule.
- **Assumption:** a reasonable reading that still needs confirmation.
- **Open:** not decided.

There is no published Iturrieta brand-guidelines PDF. Colours and fonts marked verified come from the live stylesheet, not from a brand book.

## 1. Objective and scope

Record how Sidrería Iturrieta presents itself, compare that with the homepage already in this repo, and decide what Step 05 should refine.

In scope:

- Identity, tone, colour, type, imagery, and the five public languages.
- A practical direction for a small hackathon build.

Out of scope:

- Editing application code, CSS, or components.
- Installing packages.
- Translating the site or adding a language switcher.
- New pages, booking flows, or a visual redesign from scratch.

The warm cream field stays. Forest green stays only where it matches the official site’s use of dark green (a photo backdrop), not as the main accent.

## 2. Official brand research

Primary source: [https://www.iturrieta.eus/](https://www.iturrieta.eus/), fetched 26 October 2026, including [styles.css](https://www.iturrieta.eus/styles.css).

### Identity and history

**Verified.** The homepage describes Iturrieta as a family farming project. The family arrived from Vitoria in 1997, turned the stables of a caserío in Aramaio into a sagardotegia, and opened it on Santiago’s day in 1998. They care for about 1,400 apple trees and make natural organic cider. The public line is «Sagarretik txotxera»: from the apple to the txotx.

**Verified.** The same page presents several customer-facing activities: the cider-house menu, txotx from the kupela (January to May) and bottled cider the rest of the year, concerts, guided visits, the shop, and reservations by phone and WhatsApp.

Basque cider-house culture (txotx, kupela, cuadrilla, the long table, the grill) is visible in the site’s own words. This note does not import rules from other sagardotegis.

### Visual system, as implemented

**Verified.** The top of `styles.css` comments the palette as rustic: cream/parchment, forest green, and cider gold (`Paleta rústica: crema/pergamino + verde bosque + dorado sidra`). The CSS variable names do not match those words. See section 6. The comment is a design intent. The hex values are what the site actually paints.

**Verified.** Headings use Bodoni Moda. Body, eyebrows, and the header button use Archivo. Both are loaded from Google Fonts:

`https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500&family=Archivo:wght@300;400;500;600;700&display=swap`

Headings are weight 500, tight line-height, slight negative tracking. Eyebrows are small, uppercase, widely tracked.

**Verified.** The nav logo swaps `/assets/logo.png` and `/assets/logo-blanco.png`. Both files are large line drawings of the word “iturrieta” with an apple-and-branch mark. Favicon is `/assets/logo.png`.

**Verified.** Navigation labels on the Spanish homepage: Menús, Nosotros, Visitas, Tienda, Contacto. Those links carry `data-i18n` keys (`nav_menus`, `nav_nosotros`, `nav_visitas`, `nav_tienda`, `nav_contacto`), so the same nav structure is translated rather than rebuilt per language. The header action is the phone number `685 72 15 93` (`tel:+34685721593`), styled as a pill, not the words “Reserve a table”.

**Verified.** Photography on the site is the place itself: the caserío, the valley, the kupelas, the dining room, the press, the orchard. The hero uses `assets/caserio.jpg`, with a video layer whose fallback background is `#142112`.

### Languages on the official site

**Verified** from `hreflang` on the homepage:

| Code | Language | URL | Role |
| --- | --- | --- | --- |
| `es` | Spanish | `https://www.iturrieta.eus/` | `hreflang="es"` and `x-default` |
| `eu` | Euskara | `https://www.iturrieta.eus/Euskara/` | |
| `fr` | French | `https://www.iturrieta.eus/Fran-ais/` | The path is `Fran-ais`, with a hyphen |
| `ca` | Catalan | `https://www.iturrieta.eus/Catala/` | |
| `en` | English | `https://www.iturrieta.eus/English/` | |

The switcher text is `EU ES FR CA EN`. The active language uses `aria-current="page"`. Section pages also exist under language folders, for example `/Castellano/MENUS/` and `/English/`. Spanish content is split between `/` and `/Castellano/...`. That split is theirs. It is not a pattern to copy blindly.

## 3. Brand personality and tone of voice

**Verified** from homepage copy:

- Warm and direct. The house speaks as “we”: “llegamos”, “Llámanos”, “te confirmamos la mesa”.
- Rural and specific. Place names stay in place: Aramaio, caserío, kupela, txotx, cuadrilla.
- Bilingual on the plate. Dishes are written in Basque and then in Spanish (`Txorizoa sagardotan` / Chorizo a la sidra).
- Inviting, not luxury-hotel and not a software product. The slogan is one line. Concert dates and the seasonal menu are “call us”, not a catalogue.
- The reservation voice is a phone call. “Las reservas las cogemos por teléfono y por WhatsApp. Llámanos y te confirmamos la mesa en el momento.”

**Proposed** voice for our product, in every language:

- Short sentences. Name the place and the cider before naming the software.
- Keep Basque words that are the product: txotx, kupela, sagardotegia, cuadrilla. Do not translate them away.
- A button may say “Reserve”, but nearby text must say the cider house confirms the table. The interface does not confirm it.
- Avoid startup phrasing (“seamless”, “unlock”, “experience the future”).

## 4. Existing prototype audit

Inspected on 26 October 2026:

- [app/globals.css](../../app/globals.css)
- [app/layout.tsx](../../app/layout.tsx)
- [app/page.tsx](../../app/page.tsx)
- [components/site-header.tsx](../../components/site-header.tsx)
- [components/hero.tsx](../../components/hero.tsx)
- [components/our-story.tsx](../../components/our-story.tsx)
- [components/experience.tsx](../../components/experience.tsx)
- [components/visit-us.tsx](../../components/visit-us.tsx)
- [components/site-footer.tsx](../../components/site-footer.tsx)

The page is one English homepage. `html lang` is `en`. Strings are written in the components. There is no locale route and no language switcher.

### Already in the prototype

| Decision | Where | Value |
| --- | --- | --- |
| Cream page background | `globals.css` `--cream` | `#f6f1e7` |
| Deeper cream | `--cream-deep` | `#ebe2d1` |
| Paper cards | `--paper` | `#fbf7f0` |
| Forest, used as brand green | `--forest` | `#1b3a2b` |
| Mid forest | `--forest-mid` | `#2c5340` |
| Moss | `--moss` | `#3d6a52` |
| Copper accent | `--copper` | `#a56b3c` |
| Soft copper | `--copper-soft` | `#c4895a` |
| Ink and muted text | `--ink`, `--muted` | `#1c2416`, `#4e493f` |
| Display face | `layout.tsx` | Cormorant Garamond 500–700, via `next/font` |
| Body face | `layout.tsx` | Outfit 300–600, via `next/font` |
| Layout | header, hero, story, experience, visit, footer | Sticky header, max width `72rem`, large serif titles |
| Motion | `globals.css` | Smooth scroll, turned off when `prefers-reduced-motion` |
| Focus | `globals.css` | 2px copper outline |
| Photos | `public/images/` | Caserío, press, dining room, kupelas, snow apple tree, Aramaio valley. Files copied from the official `/assets/` set |
| Copy | components | English, plus the Basque line “Sagarretik txotxera”. Visit section says a reservation is real only after the house confirms it |

The header CTA is “Reserve a Table” and only scrolls to `#visit`. It does not submit a booking.

### What should stay

- The cream page, the serif headlines, and the wide spacing.
- Real Iturrieta photographs, with alt text that describes the photo.
- The Basque slogan under the English headline.
- Sticky header, skip link, visible focus, and reduced motion.
- The sentence that the house, not this page, confirms a table.
- Phone, WhatsApp, and email as contact actions. Those details match the public site.

### What should improve

- The main accent is forest green. On the official site the accent painted as `--green` is cider brown `#A9663C`, which is almost our copper `#A56B3C`. Forest should step back to photo overlays.
- Cream `#F6F1E7` is close to official `#F7F5F1` but slightly more yellow. Move it toward the official cream.
- Cormorant Garamond and Outfit are elegant, but they are not the faces the official site loads.
- The wordmark is set in Cormorant. The official mark is the drawn logo. Keep the wordmark until that logo is checked on a cream background (see imagery).
- Navigation says Our Story / The Experience / Visit Us. The official set is Menús, Nosotros, Visitas, Tienda, Contacto. Step 05 can rename links only when those sections exist. Do not add empty pages in the name of the brand.
- The interface is English only.

### What to avoid

- Treating this homepage as a finished brand system.
- Using WhatsApp green `#25D366`, Google blue, or Instagram gradient colours as brand colours. They appear in the official CSS as icon colours.
- A purple or generic SaaS look.
- A “Reserve” button that looks like the booking is already accepted.
- Dropping Basque terms in translated UI.
- Five copies of every page.

## 5. Proposed visual direction

**Proposed.** Keep the current page structure and the cream field. Change the accent, not the layout.

The official comment asks for cream, forest, and cider gold. The CSS then uses cream, cider brown, warm stone, and a near-black. Dark green appears as the hero’s fallback behind the photograph. Our prototype already has cream, a dark green, and a cider brown. The fix is the assignment:

- Cream: page background.
- Cider brown: buttons, rules, eyebrows, active language.
- Near-black ink: text.
- Warm stone: optional secondary pill, matching their phone button.
- Dark green: only the scrim on photographs, close to `#142112`.

Do not rebuild the hero, the section order, or the component split in the name of branding.

## 6. Colour palette

### Verified on iturrieta.eus

Read from `:root` in `styles.css` unless noted.

| Token on their site | Hex | What it actually is |
| --- | --- | --- |
| `--cream` | `#F7F5F1` | Page background |
| `--cream-2` | `#EEEAE3` | Secondary surface, scrollbar track |
| `--paper` | `#FFFFFF` | White |
| `--green` | `#A9663C` | Cider brown. The name says green. The paint is brown. |
| `--green-deep` | `#8A4F2C` | Darker cider brown |
| `--green-soft` | `#F7E7D6` | Pale apricot, also used for text selection |
| `--apricot` | `#D08A5D` | Second warm accent, later in the file |
| `--gold` | `#A8A29A` | Warm stone. Header phone pill background |
| `--gold-hi` | `#D8D2C7` | Light stone |
| `--gold-deep` | `#7E7A72` | Darker stone |
| `--ink` | `#16181C` | Body text |
| `--ink-soft` | `#6A6C70` | Secondary text |
| `--bark` | `#14161A` | Near-black. Loader and page-transition curtain |
| Hero video fallback | `#142112` | Dark green behind `assets/caserio.jpg` only |
| Scrollbar thumb | `#C9B997` | Muted gold |
| WhatsApp icon | `#25D366` | Not a brand colour |

**Verified.** The header phone pill uses `background: var(--gold)` and white text. Link hovers and the active language, once the nav has scrolled, use `var(--green)` (`#A9663C`).

### Proposed for our prototype

These are not official colours. They are the current file values, and the Step 05 target next to them.

| Role | Current prototype | Proposed for Step 05 | Why |
| --- | --- | --- | --- |
| Page | `#F6F1E7` | `#F7F5F1` | Match verified `--cream` |
| Deep surface | `#EBE2D1` | `#EEEAE3` | Match verified `--cream-2` |
| Paper | `#FBF7F0` | `#FFFFFF` or keep `#FBF7F0` for cards | Official paper is pure white. A warm card can stay if contrast holds |
| Primary action | `#1B3A2B` forest | `#A9663C` cider brown | This is their real accent |
| Action hover | `#2C5340` | `#8A4F2C` | Verified `--green-deep` |
| Soft accent | `#C4895A` | `#D08A5D` or `#F7E7D6` | Verified apricot / soft |
| Text | `#1C2416` | `#16181C` | Verified ink. Drop the green cast |
| Muted text | `#4E493F` | `#6A6C70` | Verified `--ink-soft`. Check contrast on cream before using it for small text |
| Photo scrim only | `#1B3A2B` at high opacity | `#142112` | Verified hero fallback. Not a button colour |
| Stone pill, optional | none | `#A8A29A` | Verified phone-button colour |

`--moss` (`#3D6A52`) has no matching official token. **Proposed:** stop using it as a brand colour in Step 05.

## 7. Typography

### Verified

- Display: **Bodoni Moda**, weights 400, 500, 600, plus italics 400 and 500. Optical size axis `6..96`. Headings set `font-weight: 500` and `font-variation-settings: 'opsz' 110`.
- UI and body: **Archivo**, weights 300, 400, 500, 600, 700.
- Fallbacks in their CSS: Georgia / Times New Roman for the serif; system-ui, Segoe UI for the sans.
- Source: Google Fonts stylesheet linked from the homepage. Both families are published on Google Fonts under the [SIL Open Font License](https://openfontlicense.org/). No paid foundry licence is required to load them with `next/font/google`.

### Current prototype

**Verified.** [app/layout.tsx](../../app/layout.tsx) loads Cormorant Garamond and Outfit, also through `next/font/google`. Those families are Open Font License faces too. They are a reasonable editorial pair. They are not the pair Iturrieta ships.

### Proposed for Step 05

- Replace Cormorant Garamond with Bodoni Moda for headings and the wordmark.
- Replace Outfit with Archivo for body, nav, and buttons.
- Keep the current scale: large serif titles, small uppercase eyebrows, 16–18px body.
- Subset `latin`. Basque needs no extra Latin letters beyond what Spanish and French need (`ñ`, accents, `ü`). Confirm `ç` and `·` render, which they do in both families’ Latin sets.
- Do not self-host a modified logo font. Do not buy a font for the hackathon.

## 8. Imagery and photography

**Verified.** The official site uses its own photographs: the stone caserío, the valley of Aramaio, barrels, the dining room, the press, apples, and the grill. The homepage hero is `assets/caserio.jpg`.

**Verified.** Our homepage already uses six of those assets, saved under `public/images/`:

- `caserio-verano.jpg` — hero
- `prensa.jpg` — story
- `comedor.jpg`, `kupelas.jpg`, `manzano-nieve.jpg` — experience
- `valle-aramaio.jpg` — visit

**Proposed.**

- Keep using Iturrieta’s own photographs. Do not swap in generic stock cider photos.
- Credit stays as it is: photographs published by Iturrieta.
- Prefer frames without a camera timestamp or a large watermark. `atardecer.jpg` was not used for that reason.
- The drawn logo (`logo.png`, `logo-blanco.png`) was downloaded during the homepage build and looked, in that viewing, like a black field behind the line art. It was not placed on the cream page. **Open:** whether the file has a transparent background or a black matte. Until that is checked on cream and on `#142112`, Step 05 should keep the typographic wordmark.
- Hero scrim can stay, recoloured toward `#142112`, so the type remains readable on the photograph.

## 9. Five-language requirements

Do not implement this in Step 04. The requirement is to support the same five languages as the official site.

| Code | Name to show | `lang` |
| --- | --- | --- |
| `eu` | Euskara | `eu` |
| `es` | Español | `es` |
| `fr` | Français | `fr` |
| `ca` | Català | `ca` |
| `en` | English | `en` |

### Recommended approach

**Proposed.** One page tree. Five message files, for example `messages/eu.json`, `es.json`, `fr.json`, `ca.json`, `en.json`. Components read keys (`nav.story`, `cta.reserve`, `errors.required`). They do not contain a hard-coded sentence per language.

A header switcher uses the official short codes `EU ES FR CA EN`, each with `lang` and an accessible name in that language (“Euskara”, “Español”, “Français”, “Català”, “English”). The active item exposes `aria-current`. Choosing a language keeps the visitor on the same page.

Later screens (forms, errors, empty states, confirmation) use the same files. A key missing from one language should fall back to Spanish only in development, and should be listed, not silently shipped.

Dates and numbers, when they appear in Step 06, should use the active locale. Phone numbers, the address, prices, and proper names stay as published. They are not translated.

Basque and French strings are often longer than English. Buttons wrap. The nav must not use a fixed width. The official short codes keep the switcher small enough for a phone.

No translation vendor and no paid API. A person reviews Basque, Catalan, and French before the text is treated as final. Machine translation may be a draft. It is not the brand voice.

### Decisions to evaluate, not assume

**Open.** Default language. The official site uses Spanish at `/` and marks it `x-default`. Our homepage is English because the hackathon UI was written in English. Step 05 should choose one default and document it. Recommendation if nobody objects: Spanish default, matching the official site, with the switcher still one click from English.

**Open.** URL shape.

- Short prefixes: `/es`, `/eu`, `/fr`, `/ca`, `/en`. Easier to maintain. Does not match their public paths.
- Official folders: `/`, `/Euskara/`, `/Fran-ais/`, `/Catala/`, `/English/`. Familiar to their audience. The French path spelling is awkward, and Spanish is split between `/` and `/Castellano/`.

**Proposed** for the hackathon: short prefixes. State in the UI that the language names match the official site, even if the paths do not.

**Open.** Whether the language is also remembered in the browser after the first choice. A path prefix is enough for the hackathon. A cookie is optional and should not override an explicit URL.

## 10. Accessibility and visual consistency

**Verified** in our prototype already: skip link, `aria-expanded` on the menu button, `aria-labelledby` on sections, image alt text, `:focus-visible` in copper, and `prefers-reduced-motion` for smooth scroll.

**Proposed** checks for Step 05, after the palette move:

- Body text `#16181C` on `#F7F5F1` is the official pairing and should remain the default.
- Do not set small text in `#A9663C` or `#6A6C70` on cream until the contrast ratio is measured. Eyebrows can be cider brown if they are large enough, or ink if they are not.
- The photo scrim must keep white headline text above the farmhouse. Recolour the scrim without making the headline gray.
- Focus outline should move from our copper to `#8A4F2C` or ink, and stay 2px with an offset.
- The language switcher is a list of links, not a colour-only state. The active language needs `aria-current` and a weight or underline change.
- `html lang` must follow the active locale, or screen readers will pronounce Basque with English rules.
- The reservation confirmation, when it exists, must not use colour alone to mean “confirmed”.

## 11. Decisions, assumptions, and open questions

### Decisions

- This step writes documentation only.
- The cream page stays. The page structure stays.
- The primary accent for Step 05 should be the verified cider brown `#A9663C`, not forest `#1B3A2B`.
- Dark green is reserved for photograph overlays, near `#142112`.
- Step 05 should load Bodoni Moda and Archivo.
- Languages will be five message files and one shared layout, not five copies of the site.
- The interface must not say a booking is confirmed unless the cider house has confirmed it.
- Social-icon colours are out of the palette.

### Assumptions

- The stylesheet comment (“verde bosque”, “dorado sidra”) describes the mood. The hex values describe the UI. Where they disagree, Step 05 follows the hex values.
- Google Fonts’ Open Font License copies of Bodoni Moda and Archivo are acceptable. Iturrieta has not licensed a private cut that we must match.
- Official nav `data-i18n` keys mean they translate strings in place. The dictionary file itself was not downloaded, so the exact translation method (a JSON file versus inline script) is not verified.

### Open questions

- Does `logo.png` have a transparent background suitable for cream?
- Is Spanish the default language for our product, or English, while the team is building?
- Short locale prefixes, or the official folder names including `/Fran-ais/`?
- Who reviews Basque, Catalan, and French before the hackathon demo?
- Should the header action remain “Reserve a table” (our product) or become the phone number (their current site)? Both can exist. The reserve action must not imply instant confirmation.
- Their CSS calls brown `--green` and stone `--gold`. We should use role names (`cider`, `stone`) in our CSS so the next editor does not paint a forest by mistake.

## 12. Recommendations for Step 05 — UI

Do these first. Do not start flows, forms, or Supabase in that step unless a later task says so.

1. In [app/globals.css](../../app/globals.css), retoken the palette as in section 6. Rename roles so `--forest` is no longer the button colour.
2. In [app/layout.tsx](../../app/layout.tsx), swap Cormorant Garamond and Outfit for Bodoni Moda and Archivo.
3. Recolour the header button, hero button, eyebrows, and footer accent. Leave the hero photograph and its dark scrim.
4. Add a non-functional language switcher in the header (`EU ES FR CA EN`) only if Step 05 is allowed to touch the header. If the task is visual only, show the switcher as a static row and do not translate the page yet.
5. Keep the wordmark until the logo file is checked.
6. Re-check contrast and both a desktop and a 390px width after the colour change.
7. Leave booking, payments, and availability out.

Step 06 can then add real locale routes and the message files on top of this visual system.

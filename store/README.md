# MemoryLane Gifts — Complete Ecommerce Store

A full-featured personalised gifts ecommerce store built on **Medusa v2** (backend) + **Next.js 14** (storefront).

## Project Structure

```
store/
├── backend/          # Medusa v2 backend
│   ├── medusa-config.ts
│   ├── .env.template
│   └── src/
│       ├── scripts/seed.ts          # 20 products, 8 categories, 4 collections
│       └── admin/widgets/
│           └── order-personalization.tsx  # Custom admin widget
│
└── storefront/       # Next.js 14 storefront
    ├── src/
    │   ├── app/           # All pages (App Router)
    │   ├── components/
    │   │   ├── layout/    # Navbar, Footer
    │   │   ├── product/   # PersonalizationForm
    │   │   └── ui/        # ProductCard, TrustBadges
    │   └── lib/medusa.ts  # SDK + helpers
    └── tailwind.config.ts  # Gold & white brand palette
```

## Products (20 total)

| Category          | Products |
|-------------------|----------|
| Laser Engraved    | Wooden keychain, Metal wallet card, Photo frame, Jewelry box, Wine/whiskey glass, Cutting board, Leather wallet |
| Printed Products  | Photo mug, Phone case, Cushion, Canvas print, Tote bag, Notebook |
| NFC Smart Cards   | Birthday, Anniversary, Wedding, Memorial |
| Gift Bundles      | Birthday Box, Wedding Bundle, New Baby Bundle |

## Pages

| Page | Route |
|------|-------|
| Homepage | `/` |
| Shop All | `/shop` |
| Collection | `/collections/[handle]` |
| Product | `/products/[handle]` |
| Gift Finder Quiz | `/gift-finder` |
| How It Works | `/how-it-works` |
| About Us | `/about` |
| FAQ | `/faq` |
| Contact | `/contact` |
| Cart | `/cart` |

## Quick Start

### Backend

```bash
cd store/backend
cp .env.template .env
# Fill in .env values (DATABASE_URL, etc.)

npm install
npx medusa db:create
npx medusa db:migrate
npx medusa exec src/scripts/seed.ts
npm run dev
# → http://localhost:9000
# → Admin: http://localhost:9000/app
```

Create admin user:
```bash
npx medusa user -e admin@memorylane.gifts -p YourPassword123!
```

### Storefront

```bash
cd store/storefront
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

npm run dev
# → http://localhost:3000
```

## What to Customise First

1. **Brand name** — Replace "MemoryLane Gifts" globally with your store name
2. **Colour palette** — Adjust `gold-500` value in `tailwind.config.ts`
3. **Logo** — Replace the text logo in `Navbar.tsx` with your SVG/image
4. **Hero images** — Replace Unsplash placeholder URLs with your product photography
5. **Prices** — Update product prices in `seed.ts` then re-run the seed
6. **Domain & env** — Set production URLs in backend `.env` and storefront `.env.local`
7. **Payment** — Add your Stripe keys in backend `.env`
8. **Email** — Add SendGrid key and customise order confirmation templates
9. **Shipping** — Set up shipping zones and rates in the Medusa admin dashboard
10. **NFC portal** — Implement the NFC URL management endpoint (see `src/workflows/`)

## Admin Dashboard Customisation

The custom `order-personalization` widget appears on every order detail page
and shows:
- Personalisation fields per line item (name, message, date, font, NFC URL, file)
- Production type badge (Laser Engraved / Printed / NFC)
- Production days
- Gift wrap flag
- Gift message from checkout
- Bulk/corporate order flag

## Personalization Fields Reference

| Field | Products |
|-------|---------|
| `recipient_name` | All products |
| `sender_name` | Most products |
| `date` | Frames, keychains, NFC cards, bundles |
| `message` | All products |
| `occasion` | Mugs, bundles, phone cases |
| `font_style` | Keychains, jewelry boxes, notebooks, wallet cards |
| `nfc_url` | NFC cards, bundles |
| `file_upload` | Mugs, cushions, canvas, tote bags, cutting board |

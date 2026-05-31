import {
  ExecArgs,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ─── Seed Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Laser Engraved", handle: "laser-engraved", description: "Beautifully crafted laser-engraved keepsakes" },
  { name: "Printed Products", handle: "printed-products", description: "Full-color custom printed gifts" },
  { name: "NFC Smart Cards", handle: "nfc-smart-cards", description: "Tap-to-unlock digital memory cards" },
  { name: "Gift Bundles", handle: "gift-bundles", description: "Curated gift sets for every occasion" },
  { name: "Birthday Gifts", handle: "birthday-gifts", description: "Make their birthday unforgettable" },
  { name: "Wedding Gifts", handle: "wedding-gifts", description: "Cherished gifts for the happy couple" },
  { name: "Anniversary Gifts", handle: "anniversary-gifts", description: "Celebrate love milestones" },
  { name: "Baby Gifts", handle: "baby-gifts", description: "Welcome the newest member of the family" },
]

const COLLECTIONS = [
  { title: "Bestsellers", handle: "bestsellers" },
  { title: "New Arrivals", handle: "new-arrivals" },
  { title: "Valentine's Day", handle: "valentines-day" },
  { title: "Mother's Day", handle: "mothers-day" },
]

const PRODUCTS = [
  // ── LASER ENGRAVED ────────────────────────────────────────────────────────
  {
    title: "Engraved Wooden Keychain",
    handle: "engraved-wooden-keychain",
    description: "A beautifully crafted wooden keychain laser-engraved with a name, date, or short message. Made from sustainably sourced maple wood with a smooth finish. The perfect pocket-sized reminder of someone special.",
    category_handles: ["laser-engraved", "birthday-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["keychain", "wood", "engraved", "personalised"],
    production_days: 2,
    personalization_type: "engraving",
    price_usd: 1499,
    variants: [
      { title: "Maple Wood", options: { Material: "Maple Wood" } },
      { title: "Walnut Wood", options: { Material: "Walnut Wood" } },
      { title: "Bamboo", options: { Material: "Bamboo" } },
    ],
    options: [{ title: "Material", values: ["Maple Wood", "Walnut Wood", "Bamboo"] }],
    personalization_fields: ["recipient_name", "date", "message", "font_style"],
    max_chars: 30,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
  },
  {
    title: "Engraved Metal Wallet Card",
    handle: "engraved-metal-wallet-card",
    description: "Slim stainless steel wallet card laser-engraved with your chosen text. Fits perfectly in any wallet. A subtle, meaningful gift he'll carry every day.",
    category_handles: ["laser-engraved", "birthday-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["wallet", "metal", "engraved", "men"],
    production_days: 2,
    personalization_type: "engraving",
    price_usd: 1999,
    variants: [
      { title: "Silver Stainless", options: { Finish: "Silver" } },
      { title: "Gold PVD", options: { Finish: "Gold" } },
      { title: "Black Matte", options: { Finish: "Black" } },
    ],
    options: [{ title: "Finish", values: ["Silver", "Gold", "Black"] }],
    personalization_fields: ["recipient_name", "sender_name", "message", "font_style"],
    max_chars: 60,
    images: ["https://images.unsplash.com/photo-1553531087-b75f57f2e3b5?w=800"],
  },
  {
    title: "Engraved Photo Frame",
    handle: "engraved-photo-frame",
    description: "A timeless photo frame crafted from premium wood or acrylic, engraved with names, dates, or a heartfelt message. Display your favourite memory in style.",
    category_handles: ["laser-engraved", "anniversary-gifts", "wedding-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["frame", "photo", "engraved", "anniversary"],
    production_days: 3,
    personalization_type: "engraving",
    price_usd: 3499,
    variants: [
      { title: "Wood - 4x6\"", options: { Material: "Walnut Wood", Size: "4x6\"" } },
      { title: "Wood - 5x7\"", options: { Material: "Walnut Wood", Size: "5x7\"" } },
      { title: "Acrylic - 5x7\"", options: { Material: "Acrylic", Size: "5x7\"" } },
    ],
    options: [
      { title: "Material", values: ["Walnut Wood", "Acrylic"] },
      { title: "Size", values: ["4x6\"", "5x7\""] },
    ],
    personalization_fields: ["recipient_name", "sender_name", "date", "message"],
    max_chars: 80,
    images: ["https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800"],
  },
  {
    title: "Engraved Wooden Jewelry Box",
    handle: "engraved-wooden-jewelry-box",
    description: "An elegant wooden jewelry box with a laser-engraved lid personalised with her name or a meaningful message. Lined with soft velvet inside — a gift she'll treasure forever.",
    category_handles: ["laser-engraved", "anniversary-gifts"],
    collection_handle: "new-arrivals",
    type: "Laser Engraved",
    tags: ["jewelry box", "wood", "engraved", "women"],
    production_days: 3,
    personalization_type: "engraving",
    price_usd: 4999,
    variants: [
      { title: "Oak - Champagne Lining", options: { Wood: "Oak", Lining: "Champagne" } },
      { title: "Oak - Blush Lining", options: { Wood: "Oak", Lining: "Blush Pink" } },
      { title: "Walnut - Champagne Lining", options: { Wood: "Walnut", Lining: "Champagne" } },
    ],
    options: [
      { title: "Wood", values: ["Oak", "Walnut"] },
      { title: "Lining", values: ["Champagne", "Blush Pink"] },
    ],
    personalization_fields: ["recipient_name", "message", "font_style"],
    max_chars: 50,
    images: ["https://images.unsplash.com/photo-1584553421349-3557471bed79?w=800"],
  },
  {
    title: "Engraved Wine & Whiskey Glass",
    handle: "engraved-wine-whiskey-glass",
    description: "Premium hand-blown glassware with deep laser engraving. Choose wine or whiskey tumbler style and personalise with a name, date, or toast. Makes every sip more special.",
    category_handles: ["laser-engraved", "anniversary-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["glass", "wine", "whiskey", "engraved"],
    production_days: 2,
    personalization_type: "engraving",
    price_usd: 2499,
    variants: [
      { title: "Wine Glass", options: { Style: "Wine Glass" } },
      { title: "Whiskey Tumbler", options: { Style: "Whiskey Tumbler" } },
      { title: "Champagne Flute", options: { Style: "Champagne Flute" } },
    ],
    options: [{ title: "Style", values: ["Wine Glass", "Whiskey Tumbler", "Champagne Flute"] }],
    personalization_fields: ["recipient_name", "date", "message"],
    max_chars: 40,
    images: ["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800"],
  },
  {
    title: "Custom Engraved Cutting Board",
    handle: "custom-engraved-cutting-board",
    description: "A generous bamboo or walnut cutting board engraved with family names, wedding dates, or a custom design. The ultimate wedding or housewarming gift that lives on the counter.",
    category_handles: ["laser-engraved", "wedding-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["cutting board", "kitchen", "wedding", "engraved"],
    production_days: 3,
    personalization_type: "engraving",
    price_usd: 5999,
    variants: [
      { title: "Bamboo - Medium", options: { Material: "Bamboo", Size: "Medium" } },
      { title: "Bamboo - Large", options: { Material: "Bamboo", Size: "Large" } },
      { title: "Walnut - Large", options: { Material: "Walnut", Size: "Large" } },
    ],
    options: [
      { title: "Material", values: ["Bamboo", "Walnut"] },
      { title: "Size", values: ["Medium", "Large"] },
    ],
    personalization_fields: ["recipient_name", "date", "message", "file_upload"],
    max_chars: 100,
    images: ["https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800"],
  },
  {
    title: "Engraved Leather Wallet",
    handle: "engraved-leather-wallet",
    description: "Full-grain leather bifold wallet with custom laser engraving on the front panel. A classic, refined gift for him that gets better with age.",
    category_handles: ["laser-engraved", "birthday-gifts"],
    collection_handle: "bestsellers",
    type: "Laser Engraved",
    tags: ["wallet", "leather", "men", "engraved"],
    production_days: 3,
    personalization_type: "engraving",
    price_usd: 5499,
    variants: [
      { title: "Dark Brown", options: { Colour: "Dark Brown" } },
      { title: "Tan", options: { Colour: "Tan" } },
      { title: "Black", options: { Colour: "Black" } },
    ],
    options: [{ title: "Colour", values: ["Dark Brown", "Tan", "Black"] }],
    personalization_fields: ["recipient_name", "message", "font_style"],
    max_chars: 40,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"],
  },

  // ── PRINTED PRODUCTS ──────────────────────────────────────────────────────
  {
    title: "Custom Printed Photo Mug",
    handle: "custom-printed-photo-mug",
    description: "Start every morning with a smile. Upload a favourite photo and add a personal message to create a one-of-a-kind mug they'll use every day. Dishwasher safe, fade-resistant print.",
    category_handles: ["printed-products", "birthday-gifts"],
    collection_handle: "bestsellers",
    type: "Printed",
    tags: ["mug", "photo", "printed", "coffee"],
    production_days: 2,
    personalization_type: "printing",
    price_usd: 1999,
    variants: [
      { title: "11oz White", options: { Size: "11oz", Colour: "White" } },
      { title: "15oz White", options: { Size: "15oz", Colour: "White" } },
      { title: "11oz Black", options: { Size: "11oz", Colour: "Black" } },
    ],
    options: [
      { title: "Size", values: ["11oz", "15oz"] },
      { title: "Colour", values: ["White", "Black"] },
    ],
    personalization_fields: ["recipient_name", "message", "occasion", "file_upload"],
    max_chars: 60,
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800"],
  },
  {
    title: "Personalised Phone Case",
    handle: "personalised-phone-case",
    description: "Protect your phone in style with a custom-printed case featuring your chosen photo, name, or design. Slim-fit with raised edges for screen protection. Available for all major models.",
    category_handles: ["printed-products", "birthday-gifts"],
    collection_handle: "new-arrivals",
    type: "Printed",
    tags: ["phone case", "photo", "printed", "tech"],
    production_days: 2,
    personalization_type: "printing",
    price_usd: 2499,
    variants: [
      { title: "iPhone 15 Pro", options: { Model: "iPhone 15 Pro" } },
      { title: "iPhone 15", options: { Model: "iPhone 15" } },
      { title: "iPhone 14 Pro", options: { Model: "iPhone 14 Pro" } },
      { title: "Samsung S24 Ultra", options: { Model: "Samsung S24 Ultra" } },
    ],
    options: [{ title: "Model", values: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "Samsung S24 Ultra"] }],
    personalization_fields: ["recipient_name", "message", "file_upload"],
    max_chars: 30,
    images: ["https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800"],
  },
  {
    title: "Custom Printed Cushion",
    handle: "custom-printed-cushion",
    description: "Bring a personal touch to any room. Upload a photo and optional message to create a plush, full-colour printed cushion. Premium polyester cover with soft filling included.",
    category_handles: ["printed-products", "baby-gifts"],
    collection_handle: "bestsellers",
    type: "Printed",
    tags: ["cushion", "pillow", "photo", "home decor"],
    production_days: 3,
    personalization_type: "printing",
    price_usd: 2999,
    variants: [
      { title: "40x40cm", options: { Size: "40x40cm" } },
      { title: "50x50cm", options: { Size: "50x50cm" } },
    ],
    options: [{ title: "Size", values: ["40x40cm", "50x50cm"] }],
    personalization_fields: ["message", "file_upload"],
    max_chars: 60,
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
  },
  {
    title: "Personalised Canvas Photo Print",
    handle: "personalised-canvas-photo-print",
    description: "Transform your favourite photo into wall art. Gallery-wrapped canvas with vivid, fade-proof inks. Optional text overlay available. Ready to hang straight from the box.",
    category_handles: ["printed-products", "anniversary-gifts"],
    collection_handle: "bestsellers",
    type: "Printed",
    tags: ["canvas", "wall art", "photo", "print"],
    production_days: 4,
    personalization_type: "printing",
    price_usd: 4999,
    variants: [
      { title: "20x16\"", options: { Size: "20x16\"" } },
      { title: "30x20\"", options: { Size: "30x20\"" } },
      { title: "40x30\"", options: { Size: "40x30\"" } },
    ],
    options: [{ title: "Size", values: ["20x16\"", "30x20\"", "40x30\""] }],
    personalization_fields: ["message", "file_upload"],
    max_chars: 80,
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"],
  },
  {
    title: "Custom Printed Tote Bag",
    handle: "custom-printed-tote-bag",
    description: "A sturdy cotton tote bag with your chosen design, name, or photo. Perfect for bridesmaids, hen parties, birthdays, or everyday use. Natural canvas with comfortable handles.",
    category_handles: ["printed-products", "wedding-gifts"],
    collection_handle: "new-arrivals",
    type: "Printed",
    tags: ["tote bag", "cotton", "printed", "eco"],
    production_days: 2,
    personalization_type: "printing",
    price_usd: 1799,
    variants: [
      { title: "Natural Canvas", options: { Colour: "Natural" } },
      { title: "Black Canvas", options: { Colour: "Black" } },
    ],
    options: [{ title: "Colour", values: ["Natural", "Black"] }],
    personalization_fields: ["recipient_name", "message", "file_upload"],
    max_chars: 40,
    images: ["https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"],
  },
  {
    title: "Personalised Notebook",
    handle: "personalised-notebook",
    description: "An A5 hardcover notebook with a custom name or message embossed on the cover. Lined pages, ribbon bookmark, and elastic closure. The perfect gift for the writer in your life.",
    category_handles: ["printed-products", "birthday-gifts"],
    collection_handle: "new-arrivals",
    type: "Printed",
    tags: ["notebook", "stationery", "personalised"],
    production_days: 2,
    personalization_type: "printing",
    price_usd: 1999,
    variants: [
      { title: "Champagne Gold", options: { Cover: "Champagne Gold" } },
      { title: "Blush Rose", options: { Cover: "Blush Rose" } },
      { title: "Midnight Navy", options: { Cover: "Midnight Navy" } },
    ],
    options: [{ title: "Cover", values: ["Champagne Gold", "Blush Rose", "Midnight Navy"] }],
    personalization_fields: ["recipient_name", "message", "font_style"],
    max_chars: 40,
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"],
  },

  // ── NFC SMART CARDS ───────────────────────────────────────────────────────
  {
    title: "NFC Birthday Card",
    handle: "nfc-birthday-card",
    description: "The world's most thoughtful birthday card. Tap with any smartphone to unlock a personalised video message, photo album, or voice note. Beautifully printed, reusable card with embedded NFC chip. Link your own digital content — no app required.",
    category_handles: ["nfc-smart-cards", "birthday-gifts"],
    collection_handle: "new-arrivals",
    type: "NFC Smart Card",
    tags: ["NFC", "birthday", "digital", "smart card"],
    production_days: 1,
    personalization_type: "nfc",
    price_usd: 2499,
    variants: [
      { title: "Gold Foil", options: { Design: "Gold Foil" } },
      { title: "Rose Gold Foil", options: { Design: "Rose Gold Foil" } },
      { title: "Midnight Blue", options: { Design: "Midnight Blue" } },
    ],
    options: [{ title: "Design", values: ["Gold Foil", "Rose Gold Foil", "Midnight Blue"] }],
    personalization_fields: ["recipient_name", "sender_name", "message", "nfc_url"],
    max_chars: 120,
    images: ["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800"],
  },
  {
    title: "NFC Anniversary Card",
    handle: "nfc-anniversary-card",
    description: "Celebrate love with a card that holds a lifetime of memories. Tap to open a private gallery of your favourite moments together, a heartfelt video, or a voice message. Forever-keepsake quality card stock.",
    category_handles: ["nfc-smart-cards", "anniversary-gifts"],
    collection_handle: "new-arrivals",
    type: "NFC Smart Card",
    tags: ["NFC", "anniversary", "digital", "love"],
    production_days: 1,
    personalization_type: "nfc",
    price_usd: 2499,
    variants: [
      { title: "Champagne & Gold", options: { Design: "Champagne & Gold" } },
      { title: "Deep Red & Gold", options: { Design: "Deep Red & Gold" } },
    ],
    options: [{ title: "Design", values: ["Champagne & Gold", "Deep Red & Gold"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "nfc_url"],
    max_chars: 120,
    images: ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800"],
  },
  {
    title: "NFC Wedding Card",
    handle: "nfc-wedding-card",
    description: "A wedding gift that lasts forever. Give the happy couple an NFC card that taps open a private wedding album, video montage, or personalised message from guests. Luxury foil finish.",
    category_handles: ["nfc-smart-cards", "wedding-gifts"],
    collection_handle: "bestsellers",
    type: "NFC Smart Card",
    tags: ["NFC", "wedding", "digital", "luxury"],
    production_days: 1,
    personalization_type: "nfc",
    price_usd: 3499,
    variants: [
      { title: "White & Gold", options: { Design: "White & Gold" } },
      { title: "Ivory & Rose Gold", options: { Design: "Ivory & Rose Gold" } },
    ],
    options: [{ title: "Design", values: ["White & Gold", "Ivory & Rose Gold"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "nfc_url"],
    max_chars: 150,
    images: ["https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800"],
  },
  {
    title: "NFC Memorial Card",
    handle: "nfc-memorial-card",
    description: "A gentle, lasting tribute to someone cherished. Tap to open a private memorial page with photos, videos, and memories. A comforting gift for those who grieve — hold their memory forever.",
    category_handles: ["nfc-smart-cards"],
    collection_handle: "new-arrivals",
    type: "NFC Smart Card",
    tags: ["NFC", "memorial", "tribute", "remembrance"],
    production_days: 1,
    personalization_type: "nfc",
    price_usd: 2999,
    variants: [
      { title: "Ivory & Silver", options: { Design: "Ivory & Silver" } },
      { title: "White & Dove", options: { Design: "White & Dove" } },
    ],
    options: [{ title: "Design", values: ["Ivory & Silver", "White & Dove"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "nfc_url"],
    max_chars: 150,
    images: ["https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800"],
  },

  // ── GIFT BUNDLES ──────────────────────────────────────────────────────────
  {
    title: "Birthday Gift Box",
    handle: "birthday-gift-box",
    description: "The ultimate birthday surprise. This curated gift box includes a personalised engraved keychain, a custom photo mug, and an NFC Birthday Card — all beautifully packaged in our signature gift box with tissue paper and ribbon.",
    category_handles: ["gift-bundles", "birthday-gifts"],
    collection_handle: "bestsellers",
    type: "Gift Bundle",
    tags: ["bundle", "birthday", "gift box", "set"],
    production_days: 3,
    personalization_type: "mixed",
    price_usd: 5999,
    variants: [
      { title: "Gold & White Box", options: { Box: "Gold & White" } },
      { title: "Black & Gold Box", options: { Box: "Black & Gold" } },
    ],
    options: [{ title: "Box", values: ["Gold & White", "Black & Gold"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "occasion", "file_upload", "nfc_url"],
    max_chars: 120,
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"],
  },
  {
    title: "Wedding Bundle",
    handle: "wedding-bundle",
    description: "A breathtaking wedding gift set for the couple who deserves everything. Includes a personalised engraved keepsake (cutting board or photo frame), an NFC Wedding Card, and a handwritten-style note — all in our luxury white gift box.",
    category_handles: ["gift-bundles", "wedding-gifts"],
    collection_handle: "bestsellers",
    type: "Gift Bundle",
    tags: ["bundle", "wedding", "luxury", "couple"],
    production_days: 4,
    personalization_type: "mixed",
    price_usd: 9999,
    variants: [
      { title: "Classic White & Gold", options: { Box: "White & Gold" } },
      { title: "Ivory & Champagne", options: { Box: "Ivory & Champagne" } },
    ],
    options: [{ title: "Box", values: ["White & Gold", "Ivory & Champagne"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "file_upload", "nfc_url"],
    max_chars: 150,
    images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"],
  },
  {
    title: "New Baby Bundle",
    handle: "new-baby-bundle",
    description: "Welcome the newest member of the family with this adorable gift set. Includes a personalised engraved photo frame, a soft custom-printed cushion with baby's name, and an NFC card to share a birth announcement or family message. Wrapped in our pastel gift box.",
    category_handles: ["gift-bundles", "baby-gifts"],
    collection_handle: "bestsellers",
    type: "Gift Bundle",
    tags: ["bundle", "baby", "newborn", "nursery"],
    production_days: 4,
    personalization_type: "mixed",
    price_usd: 8999,
    variants: [
      { title: "Blush Pink Box", options: { Box: "Blush Pink" } },
      { title: "Powder Blue Box", options: { Box: "Powder Blue" } },
      { title: "Neutral Cream Box", options: { Box: "Neutral Cream" } },
    ],
    options: [{ title: "Box", values: ["Blush Pink", "Powder Blue", "Neutral Cream"] }],
    personalization_fields: ["recipient_name", "sender_name", "date", "message", "file_upload", "nfc_url"],
    max_chars: 120,
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800"],
  },
]

// ─── Seed Execution ───────────────────────────────────────────────────────────

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule: IProductModuleService = container.resolve(Modules.PRODUCT)
  const regionModule: IRegionModuleService = container.resolve(Modules.REGION)
  const salesChannelModule: ISalesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModule: IStoreModuleService = container.resolve(Modules.STORE)

  logger.info("🌱 Seeding MemoryLane Gifts store...")

  // ── Store ──────────────────────────────────────────────────────────────────
  const [store] = await storeModule.listStores()
  await storeModule.updateStores(store.id, {
    name: "MemoryLane Gifts",
    supported_currencies: [
      { currency_code: "usd", is_default: true },
      { currency_code: "gbp" },
      { currency_code: "eur" },
      { currency_code: "aed" },
    ],
  })
  logger.info("✅ Store updated")

  // ── Sales Channel ──────────────────────────────────────────────────────────
  const [salesChannel] = await salesChannelModule.listSalesChannels()
  await salesChannelModule.updateSalesChannels(salesChannel.id, {
    name: "MemoryLane Online Store",
    description: "Main storefront sales channel",
  })
  logger.info("✅ Sales channel updated")

  // ── Regions ────────────────────────────────────────────────────────────────
  await regionModule.createRegions([
    {
      name: "North America",
      currency_code: "usd",
      countries: ["us", "ca"],
    },
    {
      name: "United Kingdom",
      currency_code: "gbp",
      countries: ["gb"],
    },
    {
      name: "Europe",
      currency_code: "eur",
      countries: ["de", "fr", "es", "it", "nl", "be", "at", "pt"],
    },
    {
      name: "Middle East",
      currency_code: "aed",
      countries: ["ae", "sa", "kw", "qa", "bh", "om"],
    },
  ])
  logger.info("✅ Regions created")

  // ── Product Categories ─────────────────────────────────────────────────────
  const categoryMap: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const [created] = await productModule.createProductCategories([
      { name: cat.name, handle: cat.handle, description: cat.description, is_active: true },
    ])
    categoryMap[cat.handle] = created.id
  }
  logger.info(`✅ ${CATEGORIES.length} product categories created`)

  // ── Collections ────────────────────────────────────────────────────────────
  const collectionMap: Record<string, string> = {}
  for (const col of COLLECTIONS) {
    const [created] = await productModule.createCollections([
      { title: col.title, handle: col.handle },
    ])
    collectionMap[col.handle] = created.id
  }
  logger.info(`✅ ${COLLECTIONS.length} collections created`)

  // ── Products ───────────────────────────────────────────────────────────────
  for (const p of PRODUCTS) {
    const categoryIds = p.category_handles.map((h) => ({ id: categoryMap[h] })).filter((c) => c.id)
    const collectionId = p.collection_handle ? collectionMap[p.collection_handle] : undefined

    await productModule.createProducts([
      {
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: "published" as const,
        collection_id: collectionId,
        categories: categoryIds,
        options: p.options,
        variants: p.variants.map((v) => ({
          title: v.title,
          options: v.options,
          manage_inventory: false,
          prices: [{ amount: p.price_usd, currency_code: "usd" }],
        })),
        images: p.images.map((url) => ({ url })),
        thumbnail: p.images[0],
        metadata: {
          production_days: p.production_days,
          personalization_type: p.personalization_type,
          personalization_fields: JSON.stringify(p.personalization_fields),
          max_chars: p.max_chars,
          type: p.type,
        },
        tags: p.tags.map((value) => ({ value })),
        weight: 200,
      },
    ])
    logger.info(`  ✅ ${p.title}`)
  }

  logger.info(`\n🎉 MemoryLane Gifts store seeded successfully!`)
  logger.info(`   ${PRODUCTS.length} products across ${CATEGORIES.length} categories`)
  logger.info(`   4 regions with multi-currency support`)
  logger.info(`\nNext steps:`)
  logger.info(`   1. Create an admin user: npx medusa user -e admin@memorylane.gifts -p YourPassword`)
  logger.info(`   2. Set up payment providers in the admin dashboard`)
  logger.info(`   3. Configure shipping rates per region`)
  logger.info(`   4. Customise the storefront brand tokens in tailwind.config.ts`)
}

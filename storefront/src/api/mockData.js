// Curated enterprise mock data with India (INR ₹) support and Cashfree Payment Integration

export const MOCK_REGIONS = [
  {
    id: "reg_in",
    name: "India (Bharat)",
    currency_code: "inr",
    currency_symbol: "₹",
    tax_rate: 0.18, // 18% GST
    payment_providers: ["cashfree", "stripe", "manual"],
    countries: [{ iso_2: "in", display_name: "India" }]
  },
  {
    id: "reg_us",
    name: "North America",
    currency_code: "usd",
    currency_symbol: "$",
    tax_rate: 0.08,
    payment_providers: ["stripe", "manual"],
    countries: [{ iso_2: "us", display_name: "United States" }, { iso_2: "ca", display_name: "Canada" }]
  },
  {
    id: "reg_eu",
    name: "European Union",
    currency_code: "eur",
    currency_symbol: "€",
    tax_rate: 0.19,
    payment_providers: ["stripe", "manual"],
    countries: [{ iso_2: "de", display_name: "Germany" }, { iso_2: "fr", display_name: "France" }, { iso_2: "it", display_name: "Italy" }]
  },
  {
    id: "reg_uk",
    name: "United Kingdom",
    currency_code: "gbp",
    currency_symbol: "£",
    tax_rate: 0.20,
    payment_providers: ["stripe", "manual"],
    countries: [{ iso_2: "gb", display_name: "United Kingdom" }]
  },
  {
    id: "reg_jp",
    name: "Japan",
    currency_code: "jpy",
    currency_symbol: "¥",
    tax_rate: 0.10,
    payment_providers: ["stripe", "manual"],
    countries: [{ iso_2: "jp", display_name: "Japan" }]
  }
];

export const MOCK_COLLECTIONS = [
  { id: "col_all", title: "All Artifacts", handle: "all" },
  { id: "col_apparel", title: "Apparel & Knitwear", handle: "apparel" },
  { id: "col_objects", title: "Ceramics & Objects", handle: "objects" },
  { id: "col_leather", title: "Leather & Goods", handle: "leather" },
  { id: "col_timepieces", title: "Timepieces", handle: "timepieces" },
  { id: "col_scent", title: "Scent & Living", handle: "scent" }
];

export const MOCK_SHIPPING_OPTIONS = [
  {
    id: "so_standard",
    name: "Bluedart / Delhivery Insured Surface",
    price: 0,
    min_subtotal: 15000,
    estimated_days: "2-4 Business Days",
    provider_id: "cashfree-delhivery"
  },
  {
    id: "so_express",
    name: "Air Express Priority (Next-Day Metro)",
    price: 499,
    min_subtotal: 0,
    estimated_days: "1-2 Business Days",
    provider_id: "bluedart-air"
  },
  {
    id: "so_courier",
    name: "Same-Day White Glove Concierge (Mumbai/Delhi/Blr)",
    price: 999,
    min_subtotal: 0,
    estimated_days: "Same Day by 8 PM",
    provider_id: "atelier-concierge"
  }
];

export const MOCK_PRODUCTS = [
  {
    id: "prod_01",
    title: "Oversized Merino Wool Cardigan",
    subtitle: "Spun from 100% extrafine Australian merino wool with horn buttons",
    handle: "oversized-merino-wool-cardigan",
    description: "An understated silhouette crafted with dense rib-knitted organic merino wool. Relaxed drop shoulders and horn closure buttons provide effortless elegance for seasonal layering.",
    material: "100% Extrafine Merino Wool",
    origin: "Knitted in Biella, Italy",
    collection_id: "col_apparel",
    category: "Apparel",
    badge: "New Arrival",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 24990,
      usd: 285,
      eur: 260,
      gbp: 225,
      jpy: 42000
    },
    inventory_quantity: 18,
    rating: 4.9,
    reviews_count: 34,
    colors: [
      { name: "Oatmeal", hex: "#D6CEBF" },
      { name: "Charcoal", hex: "#2B2B2A" },
      { name: "Sage", hex: "#8A9484" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { id: "var_01_oat_s", title: "Oatmeal / S", sku: "CARD-OAT-S", inventory_quantity: 4, price: 24990 },
      { id: "var_01_oat_m", title: "Oatmeal / M", sku: "CARD-OAT-M", inventory_quantity: 6, price: 24990 },
      { id: "var_01_oat_l", title: "Oatmeal / L", sku: "CARD-OAT-L", inventory_quantity: 3, price: 24990 },
      { id: "var_01_chr_s", title: "Charcoal / S", sku: "CARD-CHR-S", inventory_quantity: 2, price: 24990 },
      { id: "var_01_chr_m", title: "Charcoal / M", sku: "CARD-CHR-M", inventory_quantity: 3, price: 24990 }
    ]
  },
  {
    id: "prod_02",
    title: "Minimalist Stoneware Carafe & Tumbler",
    subtitle: "Wheel-thrown raw volcanic clay with matte porcelain interior",
    handle: "minimalist-stoneware-carafe-tumbler",
    description: "Designed in collaboration with Kyoto ceramists. The balanced proportions and tactile textured stoneware surface make hydration an intentional ritual.",
    material: "Stoneware & Food-safe Porcelain Glaze",
    origin: "Kyoto, Japan",
    collection_id: "col_objects",
    category: "Objects",
    badge: "Bestseller",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 9990,
      usd: 120,
      eur: 110,
      gbp: 95,
      jpy: 18000
    },
    inventory_quantity: 24,
    rating: 5.0,
    reviews_count: 52,
    colors: [
      { name: "Volcanic Sand", hex: "#C2B29D" },
      { name: "Matte Terra", hex: "#8F5E4B" }
    ],
    sizes: ["500ml", "850ml"],
    variants: [
      { id: "var_02_500", title: "500ml Set", sku: "CAR-500", inventory_quantity: 14, price: 9990 },
      { id: "var_02_850", title: "850ml Set", sku: "CAR-850", inventory_quantity: 10, price: 12490 }
    ]
  },
  {
    id: "prod_03",
    title: "Sculpted Vegetable-Tanned Folio",
    subtitle: "Hand-stitched Tuscan bridle leather with solid brass hardware",
    handle: "sculpted-vegetable-tanned-folio",
    description: "An architectural everyday leather portfolio engineered to hold a 14-inch device, notebooks, and writing instruments. Ages with a bespoke deep patina.",
    material: "Full-Grain Tuscan Bridle Leather",
    origin: "Florence, Italy",
    collection_id: "col_leather",
    category: "Leather",
    badge: "Editorial Pick",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 28500,
      usd: 340,
      eur: 310,
      gbp: 270,
      jpy: 51000
    },
    inventory_quantity: 9,
    rating: 4.8,
    reviews_count: 28,
    colors: [
      { name: "Saddle Tan", hex: "#9C6B3F" },
      { name: "Obsidian Black", hex: "#1D1D1F" }
    ],
    sizes: ["One Size"],
    variants: [
      { id: "var_03_tan", title: "Saddle Tan", sku: "FOLIO-TAN", inventory_quantity: 5, price: 28500 },
      { id: "var_03_blk", title: "Obsidian Black", sku: "FOLIO-BLK", inventory_quantity: 4, price: 28500 }
    ]
  },
  {
    id: "prod_04",
    title: "Monolithic Bauhaus Automatic Watch",
    subtitle: "Swiss automatic movement with sapphire crystal and exhibition back",
    handle: "monolithic-bauhaus-automatic-watch",
    description: "Stripped of superfluous ornament, the Bauhaus automatic timepiece celebrates precision mechanics. 38mm brushed 316L stainless casing with 42h power reserve.",
    material: "316L Stainless Steel & Double Sapphire",
    origin: "Geneva, Switzerland",
    collection_id: "col_timepieces",
    category: "Timepieces",
    badge: "Limited Edition",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 56900,
      usd: 680,
      eur: 620,
      gbp: 540,
      jpy: 99000
    },
    inventory_quantity: 7,
    rating: 4.95,
    reviews_count: 67,
    colors: [
      { name: "Brushed Steel", hex: "#C7C8CC" },
      { name: "Matte Anthracite", hex: "#3A3B3C" }
    ],
    sizes: ["38mm", "40mm"],
    variants: [
      { id: "var_04_38s", title: "38mm Steel", sku: "WATCH-38-S", inventory_quantity: 4, price: 56900 },
      { id: "var_04_40s", title: "40mm Steel", sku: "WATCH-40-S", inventory_quantity: 3, price: 59900 }
    ]
  },
  {
    id: "prod_05",
    title: "Hinoki & Smoked Vetiver Botanical Diffuser",
    subtitle: "Cold-pressed therapeutic essences in a hand-cut smoked glass vessel",
    handle: "hinoki-smoked-vetiver-diffuser",
    description: "Top notes of Japanese cypress (Hinoki) grounding into cedarwood heart and smoked Haitian vetiver. Infuses living spaces with meditative tranquility.",
    material: "Smoked Glass & Natural Rattan Reeds",
    origin: "Grasse, France",
    collection_id: "col_scent",
    category: "Scent",
    badge: "Eco Blend",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 7990,
      usd: 95,
      eur: 88,
      gbp: 75,
      jpy: 14500
    },
    inventory_quantity: 32,
    rating: 4.88,
    reviews_count: 41,
    colors: [
      { name: "Smoked Amber", hex: "#7E5229" }
    ],
    sizes: ["200ml", "400ml Refill"],
    variants: [
      { id: "var_05_200", title: "200ml Vessel + Reeds", sku: "SCENT-200", inventory_quantity: 20, price: 7990 },
      { id: "var_05_ref", title: "400ml Refill Flacon", sku: "SCENT-REF", inventory_quantity: 12, price: 5490 }
    ]
  },
  {
    id: "prod_06",
    title: "Raw Japanese Selvedge Denim Trouser",
    subtitle: "13.5oz shuttle-loom shuttle selvedge woven in Okayama",
    handle: "raw-japanese-selvedge-denim-trouser",
    description: "Woven on vintage Toyoda shuttle looms with ring-spun indigo cotton. Clean straight cut with copper hardware and a crisp unwashed structure.",
    material: "100% Okayama Selvedge Cotton",
    origin: "Kojima, Okayama, Japan",
    collection_id: "col_apparel",
    category: "Apparel",
    badge: "Artisanal",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 19990,
      usd: 240,
      eur: 220,
      gbp: 190,
      jpy: 36000
    },
    inventory_quantity: 15,
    rating: 4.9,
    reviews_count: 19,
    colors: [
      { name: "Indigo Raw", hex: "#1A2536" },
      { name: "Natural Ecru", hex: "#F3ECE1" }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    variants: [
      { id: "var_06_30", title: "Indigo / 30", sku: "SEL-30-IND", inventory_quantity: 5, price: 19990 },
      { id: "var_06_32", title: "Indigo / 32", sku: "SEL-32-IND", inventory_quantity: 7, price: 19990 },
      { id: "var_06_34", title: "Indigo / 34", sku: "SEL-34-IND", inventory_quantity: 3, price: 19990 }
    ]
  },
  {
    id: "prod_07",
    title: "Travertine Stone Pedestal Lamp",
    subtitle: "Honed Roman travertine pillar with linen drum shade and warm dimming",
    handle: "travertine-stone-pedestal-lamp",
    description: "Solid travertine stone base carved from unpolished Italian quarry blocks. Features tactile solid brass rotary dimmer and natural Belgian linen diffuser.",
    material: "Honed Roman Travertine & Linen",
    origin: "Tivoli, Italy",
    collection_id: "col_objects",
    category: "Objects",
    badge: "Design Award",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513506003901-2e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 34900,
      usd: 420,
      eur: 385,
      gbp: 335,
      jpy: 62000
    },
    inventory_quantity: 6,
    rating: 5.0,
    reviews_count: 14,
    colors: [
      { name: "Cream Travertine", hex: "#E3DAC9" }
    ],
    sizes: ["Standard Table (45cm)"],
    variants: [
      { id: "var_07_std", title: "Cream Travertine", sku: "LAMP-TRAV", inventory_quantity: 6, price: 34900 }
    ]
  },
  {
    id: "prod_08",
    title: "Anodized Aluminum Key Organizer",
    subtitle: "Precision CNC milled aerospace aluminum with magnetic latch",
    handle: "anodized-aluminum-key-organizer",
    description: "Engineered to silence rattling keys in an ultra-slim aerospace grade enclosure. Holds up to 8 keys with integrated titanium pocket clip.",
    material: "6061-T6 Anodized Aluminum",
    origin: "Munich, Germany",
    collection_id: "col_objects",
    category: "Objects",
    badge: "Everyday Carry",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85"
    ],
    prices: {
      inr: 5490,
      usd: 65,
      eur: 60,
      gbp: 52,
      jpy: 9800
    },
    inventory_quantity: 40,
    rating: 4.8,
    reviews_count: 88,
    colors: [
      { name: "Space Grey", hex: "#505156" },
      { name: "Silver Anodized", hex: "#D4D5D9" },
      { name: "Forest Olive", hex: "#4B5320" }
    ],
    sizes: ["Compact"],
    variants: [
      { id: "var_08_gry", title: "Space Grey", sku: "KEY-GRY", inventory_quantity: 20, price: 5490 },
      { id: "var_08_slv", title: "Silver Anodized", sku: "KEY-SLV", inventory_quantity: 20, price: 5490 }
    ]
  }
];

export const MOCK_ORDERS = [
  {
    id: "ord_01J8K901",
    display_id: 1042,
    status: "completed",
    fulfillment_status: "delivered",
    payment_status: "captured",
    payment_provider: "cashfree",
    created_at: "2026-08-16T14:32:00Z",
    currency_code: "inr",
    total: 53490.00,
    subtotal: 45330.50,
    tax_total: 8159.50,
    discount_total: 0.00,
    shipping_total: 0.00,
    tracking_number: "BLUEDART-EXP-9921448",
    customer: {
      id: "cus_01",
      email: "aditya.sharma@bangalore-tech.in",
      first_name: "Aditya",
      last_name: "Sharma",
      phone: "+91 98450 12345"
    },
    shipping_address: {
      address_1: "Villa 14, Palm Meadows, Whitefield",
      city: "Bengaluru",
      postal_code: "560066",
      country_code: "in"
    },
    items: [
      {
        id: "item_01",
        title: "Oversized Merino Wool Cardigan",
        variant: { title: "Oatmeal / M", sku: "CARD-OAT-M" },
        unit_price: 24990,
        quantity: 1,
        thumbnail: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: "item_03",
        title: "Sculpted Vegetable-Tanned Folio",
        variant: { title: "Saddle Tan", sku: "FOLIO-TAN" },
        unit_price: 28500,
        quantity: 1,
        thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80"
      }
    ]
  },
  {
    id: "ord_01J8K902",
    display_id: 1043,
    status: "processing",
    fulfillment_status: "shipped",
    payment_status: "captured",
    payment_provider: "cashfree",
    created_at: "2026-08-17T09:15:00Z",
    currency_code: "inr",
    total: 56900.00,
    subtotal: 48220.34,
    tax_total: 8679.66,
    discount_total: 0.00,
    shipping_total: 0.00,
    tracking_number: "DELHIVERY-AIR-8841902",
    customer: {
      id: "cus_02",
      email: "priya.mehta@mumbai-design.in",
      first_name: "Priya",
      last_name: "Mehta",
      phone: "+91 98200 98765"
    },
    shipping_address: {
      address_1: "Flat 12B, Altamount Road",
      city: "Mumbai",
      postal_code: "400026",
      country_code: "in"
    },
    items: [
      {
        id: "item_04",
        title: "Monolithic Bauhaus Automatic Watch",
        variant: { title: "38mm Steel", sku: "WATCH-38-S" },
        unit_price: 56900,
        quantity: 1,
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80"
      }
    ]
  },
  {
    id: "ord_01J8K903",
    display_id: 1044,
    status: "pending",
    fulfillment_status: "not_fulfilled",
    payment_status: "captured",
    payment_provider: "cashfree",
    created_at: "2026-08-18T18:40:00Z",
    currency_code: "inr",
    total: 17980.00,
    subtotal: 15237.29,
    tax_total: 2742.71,
    discount_total: 0.00,
    shipping_total: 0.00,
    tracking_number: null,
    customer: {
      id: "cus_03",
      email: "rohan.kapoor@delhi-living.in",
      first_name: "Rohan",
      last_name: "Kapoor",
      phone: "+91 99110 54321"
    },
    shipping_address: {
      address_1: "7 Golf Links",
      city: "New Delhi",
      postal_code: "110003",
      country_code: "in"
    },
    items: [
      {
        id: "item_05",
        title: "Minimalist Stoneware Carafe & Tumbler",
        variant: { title: "500ml Set", sku: "CAR-500" },
        unit_price: 9990,
        quantity: 1,
        thumbnail: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: "item_06",
        title: "Hinoki & Smoked Vetiver Botanical Diffuser",
        variant: { title: "200ml Vessel", sku: "SCENT-200" },
        unit_price: 7990,
        quantity: 1,
        thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80"
      }
    ]
  }
];

export const MOCK_CUSTOMERS = [
  {
    id: "cus_01",
    first_name: "Aditya",
    last_name: "Sharma",
    email: "aditya.sharma@bangalore-tech.in",
    phone: "+91 98450 12345",
    orders_count: 4,
    total_spent: 142500.00,
    created_at: "2026-01-15T10:00:00Z",
    tier: "VIP Patron",
    addresses: [
      { id: "addr_01", address_1: "Villa 14, Palm Meadows, Whitefield", city: "Bengaluru", postal_code: "560066", country_code: "in", is_default: true }
    ]
  },
  {
    id: "cus_02",
    first_name: "Priya",
    last_name: "Mehta",
    email: "priya.mehta@mumbai-design.in",
    phone: "+91 98200 98765",
    orders_count: 2,
    total_spent: 85400.00,
    created_at: "2026-03-20T12:00:00Z",
    tier: "Collector",
    addresses: [
      { id: "addr_02", address_1: "Flat 12B, Altamount Road", city: "Mumbai", postal_code: "400026", country_code: "in", is_default: true }
    ]
  },
  {
    id: "cus_03",
    first_name: "Rohan",
    last_name: "Kapoor",
    email: "rohan.kapoor@delhi-living.in",
    phone: "+91 99110 54321",
    orders_count: 3,
    total_spent: 64200.00,
    created_at: "2026-04-10T15:30:00Z",
    tier: "Collector",
    addresses: [
      { id: "addr_03", address_1: "7 Golf Links", city: "New Delhi", postal_code: "110003", country_code: "in", is_default: true }
    ]
  }
];

export const MOCK_DISCOUNTS = [
  {
    id: "disc_01",
    code: "MEDUSA10",
    description: "10% off entire order for Medusa community",
    type: "percentage",
    value: 10,
    usage_limit: 500,
    usage_count: 142,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "disc_02",
    code: "ATELIER20",
    description: "20% off for verified VIP Atelier patrons",
    type: "percentage",
    value: 20,
    usage_limit: 100,
    usage_count: 38,
    is_active: true,
    created_at: "2026-02-14T00:00:00Z"
  },
  {
    id: "disc_03",
    code: "FREESHIP",
    description: "Complimentary express delivery across India",
    type: "free_shipping",
    value: 0,
    usage_limit: 1000,
    usage_count: 284,
    is_active: true,
    created_at: "2026-03-01T00:00:00Z"
  }
];

export const MOCK_ANALYTICS = {
  gross_revenue: 8450000.00, // in INR
  net_revenue: 7161000.00,
  orders_count: 324,
  average_order_value: 26080.00,
  conversion_rate: 4.12,
  sales_trend: [
    { label: "Feb", value: 890000 },
    { label: "Mar", value: 1140000 },
    { label: "Apr", value: 1350000 },
    { label: "May", value: 1220000 },
    { label: "Jun", value: 1680000 },
    { label: "Jul", value: 1540000 },
    { label: "Aug", value: 1980000 }
  ]
};

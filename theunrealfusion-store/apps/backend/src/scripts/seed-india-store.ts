import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createProductsWorkflow,
  createCollectionsWorkflow,
  createShippingProfilesWorkflow,
  createShippingOptionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/core-flows"

export default async function seedIndiaStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const regionService = container.resolve(Modules.REGION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const pricingService = container.resolve(Modules.PRICING)
  const apiKeyService = container.resolve(Modules.API_KEY)

  logger.info("🇮🇳 Starting India Region & Store Catalog Seeding...")

  // 1. Check or Create India Region
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.*", "payment_providers.*"],
  })

  let indiaRegion = existingRegions.find(
    (r: any) => r.currency_code === "inr" || r.name.toLowerCase().includes("india")
  )

  if (!indiaRegion) {
    logger.info("Creating India Region (INR - ₹)...")
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: ["pp_cashfree_cashfree", "pp_system_default"],
          },
        ],
      },
    })
    indiaRegion = regionResult[0]
    logger.info(`✅ India Region created successfully with ID: ${indiaRegion.id}`)
  } else {
    logger.info(`Found existing India Region: ${indiaRegion.id} (${indiaRegion.name})`)
  }

  // 2. Ensure Sales Channel
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name", "is_disabled"],
  })

  const defaultSalesChannel = salesChannels[0]
  logger.info(`Using Sales Channel: ${defaultSalesChannel.id} (${defaultSalesChannel.name})`)

  // 3. Ensure Publishable API Key links to sales channel
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
  })

  const publishableKey = apiKeys.find((k: any) => k.type === "publishable")
  if (publishableKey) {
    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: publishableKey.id,
          add: [defaultSalesChannel.id],
        },
      })
      logger.info(`✅ Linked API key ${publishableKey.token.slice(0, 10)}... to Sales Channel`)
    } catch (e: any) {
      logger.info(`Sales channel link: ${e.message || "already linked"}`)
    }
  }

  // 4. Fulfillment & Shipping Options for India
  logger.info("Setting up Shipping & Fulfillment for India...")
  let shippingProfiles = await fulfillmentService.listShippingProfiles()
  let defaultProfile = shippingProfiles.find((p: any) => p.type === "default")

  if (!defaultProfile) {
    const { result: profileResult } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    })
    defaultProfile = profileResult[0]
  }

  // Check or create stock location
  let stockLocations = await stockLocationService.listStockLocations()
  let defaultLocation = stockLocations[0]
  if (!defaultLocation) {
    defaultLocation = await stockLocationService.createStockLocations({
      name: "Mumbai Central Fulfillment Hub",
      address: {
        address_1: "BKC Commercial Complex",
        city: "Mumbai",
        country_code: "in",
        postal_code: "400051",
      },
    })
  }

  // Ensure fulfillment sets & service zones
  let fulfillmentSets = await fulfillmentService.listFulfillmentSets(
    {},
    { relations: ["service_zones", "service_zones.geo_zones"] }
  )

  let defaultSet = fulfillmentSets[0]
  let serviceZone: any
  if (!defaultSet) {
    defaultSet = await fulfillmentService.createFulfillmentSets({
      name: "India Delivery Network",
      type: "shipping",
      service_zones: [
        {
          name: "All India Coverage",
          geo_zones: [
            {
              type: "country",
              country_code: "in",
            },
          ],
        },
      ],
    })
    serviceZone = defaultSet.service_zones[0]
  } else {
    serviceZone = defaultSet.service_zones?.[0]
    if (!serviceZone) {
      serviceZone = await fulfillmentService.createServiceZones({
        name: "All India Coverage",
        fulfillment_set_id: defaultSet.id,
        geo_zones: [
          {
            type: "country",
            country_code: "in",
          },
        ],
      })
    }
  }

  // Create India Shipping Options if not existing
  const existingShippingOptions = await fulfillmentService.listShippingOptions()
  const hasIndiaStandard = existingShippingOptions.some((o: any) =>
    o.name?.toLowerCase().includes("standard")
  )

  if (!hasIndiaStandard && serviceZone) {
    try {
      await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "Standard Delivery (Pan-India)",
            service_zone_id: serviceZone.id,
            shipping_profile_id: defaultProfile.id,
            provider_id: "manual_manual",
            price_type: "flat",
            type: {
              label: "Standard",
              description: "Delivered in 3-5 business days across India",
              code: "standard-in",
            },
            prices: [
              {
                currency_code: "inr",
                amount: 0, // Free shipping
              },
              {
                currency_code: "usd",
                amount: 0,
              },
            ],
            rules: [],
          },
          {
            name: "Express Priority (Metros 24-48 Hours)",
            service_zone_id: serviceZone.id,
            shipping_profile_id: defaultProfile.id,
            provider_id: "manual_manual",
            price_type: "flat",
            type: {
              label: "Express",
              description: "Fast courier delivery for urgent orders",
              code: "express-in",
            },
            prices: [
              {
                currency_code: "inr",
                amount: 149,
              },
              {
                currency_code: "usd",
                amount: 5,
              },
            ],
            rules: [],
          },
          {
            name: "Cash on Delivery (COD Handling)",
            service_zone_id: serviceZone.id,
            shipping_profile_id: defaultProfile.id,
            provider_id: "manual_manual",
            price_type: "flat",
            type: {
              label: "COD",
              description: "Pay with cash on doorstep delivery",
              code: "cod-in",
            },
            prices: [
              {
                currency_code: "inr",
                amount: 49,
              },
              {
                currency_code: "usd",
                amount: 2,
              },
            ],
            rules: [],
          },
        ],
      })
      logger.info("✅ Created India Shipping Options (Standard Free, Express ₹149, COD ₹49)")
    } catch (e: any) {
      logger.warn(`Shipping options creation notice: ${e.message}`)
    }
  }

  // 5. Product Collections
  logger.info("Creating Product Collections...")
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"],
  })

  let techCol = existingCollections.find((c: any) => c.handle === "tech-audio")
  let apparelCol = existingCollections.find((c: any) => c.handle === "designer-apparel")
  let lifestyleCol = existingCollections.find((c: any) => c.handle === "modern-living")
  let accessoriesCol = existingCollections.find((c: any) => c.handle === "luxury-accessories")

  if (!techCol || !apparelCol || !lifestyleCol || !accessoriesCol) {
    const { result: cols } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          {
            title: "Tech & Audio",
            handle: "tech-audio",
          },
          {
            title: "Designer Apparel",
            handle: "designer-apparel",
          },
          {
            title: "Modern Living",
            handle: "modern-living",
          },
          {
            title: "Luxury Accessories",
            handle: "luxury-accessories",
          },
        ],
      },
    })
    techCol = cols.find((c: any) => c.handle === "tech-audio")
    apparelCol = cols.find((c: any) => c.handle === "designer-apparel")
    lifestyleCol = cols.find((c: any) => c.handle === "modern-living")
    accessoriesCol = cols.find((c: any) => c.handle === "luxury-accessories")
    logger.info("✅ Created Curated Collections")
  }

  // 6. Curated Leading E-Commerce Catalog with INR Prices
  logger.info("Creating flagship e-commerce product catalog...")

  const catalogProducts = [
    {
      title: "Aura Spatial Wireless Headphones Pro",
      handle: "aura-spatial-headphones-pro",
      subtitle: "Active Noise Cancellation, Hi-Res Audio, 40h Battery",
      description:
        "Engineered with custom 45mm neodymium drivers and precision aerospace aluminum casing. Experience ultra-low latency wireless audio, 40dB hybrid ANC, and crystal-clear spatial audio with immersive head tracking. Designed for discerning audiophiles and modern professionals.",
      collection_id: techCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Color",
          values: ["Matte Obsidian", "Platinum Silver", "Midnight Navy"],
        },
      ],
      variants: [
        {
          title: "Matte Obsidian",
          sku: "AURA-HEADPHONE-BLK",
          options: { Color: "Matte Obsidian" },
          prices: [
            { currency_code: "inr", amount: 14999 },
            { currency_code: "usd", amount: 179 },
            { currency_code: "eur", amount: 165 },
          ],
        },
        {
          title: "Platinum Silver",
          sku: "AURA-HEADPHONE-SLV",
          options: { Color: "Platinum Silver" },
          prices: [
            { currency_code: "inr", amount: 14999 },
            { currency_code: "usd", amount: 179 },
            { currency_code: "eur", amount: 165 },
          ],
        },
        {
          title: "Midnight Navy",
          sku: "AURA-HEADPHONE-NVY",
          options: { Color: "Midnight Navy" },
          prices: [
            { currency_code: "inr", amount: 15499 },
            { currency_code: "usd", amount: 185 },
            { currency_code: "eur", amount: 170 },
          ],
        },
      ],
    },
    {
      title: "Obsidian Titanium Smartwatch Ultra",
      handle: "obsidian-titanium-smartwatch",
      subtitle: "Sapphire Glass, ECG, AMOLED 2000nits, 7-Day Battery",
      description:
        "Crafted from aerospace-grade Grade 5 titanium with an ultra-bright always-on Sapphire AMOLED display. Features dual-frequency GPS, health biometric sensors (ECG, SpO2, Heart Rate), 5ATM water resistance, and fast magnetic wireless charging.",
      collection_id: techCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Strap",
          values: ["Fluoroelastomer Sport", "Titanium Link Bracelet"],
        },
      ],
      variants: [
        {
          title: "Fluoroelastomer Sport",
          sku: "OBSIDIAN-WATCH-SPORT",
          options: { Strap: "Fluoroelastomer Sport" },
          prices: [
            { currency_code: "inr", amount: 19999 },
            { currency_code: "usd", amount: 239 },
            { currency_code: "eur", amount: 220 },
          ],
        },
        {
          title: "Titanium Link Bracelet",
          sku: "OBSIDIAN-WATCH-TITANIUM",
          options: { Strap: "Titanium Link Bracelet" },
          prices: [
            { currency_code: "inr", amount: 24999 },
            { currency_code: "usd", amount: 299 },
            { currency_code: "eur", amount: 275 },
          ],
        },
      ],
    },
    {
      title: "Signature Heavyweight French Terry Hoodie",
      handle: "heavyweight-french-terry-hoodie",
      subtitle: "500 GSM 100% Organic Combed Cotton",
      description:
        "Constructed with ultra-heavyweight 500 GSM French terry cotton. Pre-shrunk with a relaxed drop-shoulder silhouette, double-layered architectural hood, and concealed side seam pockets for clean luxury aesthetics.",
      collection_id: apparelCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Size",
          values: ["S", "M", "L", "XL"],
        },
        {
          title: "Color",
          values: ["Washed Onyx", "Alabaster White"],
        },
      ],
      variants: [
        {
          title: "S / Washed Onyx",
          sku: "HOODIE-S-BLK",
          options: { Size: "S", Color: "Washed Onyx" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
        {
          title: "M / Washed Onyx",
          sku: "HOODIE-M-BLK",
          options: { Size: "M", Color: "Washed Onyx" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
        {
          title: "L / Washed Onyx",
          sku: "HOODIE-L-BLK",
          options: { Size: "L", Color: "Washed Onyx" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
        {
          title: "XL / Washed Onyx",
          sku: "HOODIE-XL-BLK",
          options: { Size: "XL", Color: "Washed Onyx" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
        {
          title: "M / Alabaster White",
          sku: "HOODIE-M-WHT",
          options: { Size: "M", Color: "Alabaster White" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
        {
          title: "L / Alabaster White",
          sku: "HOODIE-L-WHT",
          options: { Size: "L", Color: "Alabaster White" },
          prices: [
            { currency_code: "inr", amount: 4499 },
            { currency_code: "usd", amount: 55 },
            { currency_code: "eur", amount: 50 },
          ],
        },
      ],
    },
    {
      title: "Lumos Minimalist Ceramic Ambient Lamp",
      handle: "lumos-minimalist-ceramic-lamp",
      subtitle: "Hand-thrown Terracotta, Dimmable Warm 2700K Glow",
      description:
        "Individually hand-thrown ceramic lamp with a tactile matte glazed finish. Features seamless brass touch controls, dimmable LED warm ambient illumination, and integrated magnetic wireless power charging base.",
      collection_id: lifestyleCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&auto=format&fit=crop&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Finish",
          values: ["Sand Ceramic", "Charcoal Clay"],
        },
      ],
      variants: [
        {
          title: "Sand Ceramic",
          sku: "LUMOS-LAMP-SAND",
          options: { Finish: "Sand Ceramic" },
          prices: [
            { currency_code: "inr", amount: 6999 },
            { currency_code: "usd", amount: 85 },
            { currency_code: "eur", amount: 78 },
          ],
        },
        {
          title: "Charcoal Clay",
          sku: "LUMOS-LAMP-CHAR",
          options: { Finish: "Charcoal Clay" },
          prices: [
            { currency_code: "inr", amount: 6999 },
            { currency_code: "usd", amount: 85 },
            { currency_code: "eur", amount: 78 },
          ],
        },
      ],
    },
    {
      title: "Artisan Full-Grain Leather Cardholder & Clip",
      handle: "artisan-leather-cardholder",
      subtitle: "Vegetable-tanned Italian Vachetta Leather",
      description:
        "Hand-stitched in small batches using full-grain Italian vegetable-tanned leather with burnished edges. Develops a rich, one-of-a-kind golden patina over time. Equipped with RFID shielding and spring-loaded stainless steel money clip.",
      collection_id: accessoriesCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Leather Color",
          values: ["Cognac Tan", "Espresso Black", "Olive Drab"],
        },
      ],
      variants: [
        {
          title: "Cognac Tan",
          sku: "WALLET-COGNAC",
          options: { "Leather Color": "Cognac Tan" },
          prices: [
            { currency_code: "inr", amount: 2499 },
            { currency_code: "usd", amount: 30 },
            { currency_code: "eur", amount: 28 },
          ],
        },
        {
          title: "Espresso Black",
          sku: "WALLET-BLK",
          options: { "Leather Color": "Espresso Black" },
          prices: [
            { currency_code: "inr", amount: 2499 },
            { currency_code: "usd", amount: 30 },
            { currency_code: "eur", amount: 28 },
          ],
        },
        {
          title: "Olive Drab",
          sku: "WALLET-OLIVE",
          options: { "Leather Color": "Olive Drab" },
          prices: [
            { currency_code: "inr", amount: 2799 },
            { currency_code: "usd", amount: 34 },
            { currency_code: "eur", amount: 31 },
          ],
        },
      ],
    },
    {
      title: "Botanical Ultrasonic Aroma Diffuser & Humidifier",
      handle: "botanical-ultrasonic-aroma-diffuser",
      subtitle: "Whisper-quiet 2.4MHz Ultrasonic, Stone Glass Dome",
      description:
        "A sculptural wellness piece featuring a frosted glass dome and solid matte base. Disperses pure essential oils in ultra-fine cool mist with subtle circadian warm lighting and auto-shutoff safety timer.",
      collection_id: lifestyleCol?.id,
      sales_channels: [{ id: defaultSalesChannel.id }],
      thumbnail:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
      images: [
        {
          url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&auto=format&fit=crop&q=80",
        },
      ],
      options: [
        {
          title: "Edition",
          values: ["Alabaster White", "Basalt Black"],
        },
      ],
      variants: [
        {
          title: "Alabaster White",
          sku: "DIFFUSER-WHT",
          options: { Edition: "Alabaster White" },
          prices: [
            { currency_code: "inr", amount: 3999 },
            { currency_code: "usd", amount: 49 },
            { currency_code: "eur", amount: 45 },
          ],
        },
        {
          title: "Basalt Black",
          sku: "DIFFUSER-BLK",
          options: { Edition: "Basalt Black" },
          prices: [
            { currency_code: "inr", amount: 3999 },
            { currency_code: "usd", amount: 49 },
            { currency_code: "eur", amount: 45 },
          ],
        },
      ],
    },
  ]

  // Check existing products by handle
  const { data: existingProds } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProds.map((p: any) => p.handle))

  const newProducts = catalogProducts.filter((p) => !existingHandles.has(p.handle))

  if (newProducts.length > 0) {
    logger.info(`Creating ${newProducts.length} flagship products...`)
    await createProductsWorkflow(container).run({
      input: {
        products: newProducts as any,
      },
    })
    logger.info(`✅ Successfully created ${newProducts.length} new flagship products!`)
  } else {
    logger.info("All flagship products already exist in catalog.")
  }

  // Ensure all existing variants have INR prices
  const { data: allVariants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "sku", "prices.*"],
  })

  logger.info(`Checking INR prices on ${allVariants.length} product variants...`)
  for (const variant of allVariants) {
    const hasInrPrice = variant.prices?.some((p: any) => p.currency_code === "inr")
    if (!hasInrPrice) {
      const existingPrice = variant.prices?.[0]
      const fallbackAmount = existingPrice ? Math.round(existingPrice.amount * 85) : 1999
      try {
        await pricingService.createPrices([
          {
            currency_code: "inr",
            amount: fallbackAmount,
            price_list_id: null,
            rules: {},
          },
        ])
      } catch (e: any) {
        // Price creation
      }
    }
  }

  logger.info("🎉 Store Seeding for India Region & Catalog Finished Successfully!")
}

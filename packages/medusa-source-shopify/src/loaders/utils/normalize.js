export function normalizeProduct(shopifyProduct) {
  return {
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    options:
      shopifyProduct.options.map((option) => normalizeOption(option)) || [],
    variants:
      shopifyProduct.variants.map((variant) => normalizeVariant(variant)) || [],
    tags: shopifyProduct.tags.split(",").map((tag) => normalizeTag(tag)) || [],
    images: shopifyProduct.images.map((img) => img.src) || [],
    thumbnail: shopifyProduct.image?.src || null,
    metadata: {
      sh_id: shopifyProduct.id,
    },
    status: "proposed", //products from Shopify should always be proposed
  }
}

function normalizeOption(option) {
  return {
    title: option.name,
    values: option.values.map((v) => {
      return { value: v }
    }),
  }
}

function normalizeVariant(variant) {
  return {
    title: variant.title,
    prices: normalizePrices(variant.presentment_prices),
    sku: variant.sku,
    barcode: variant.barcode,
    upc: variant.barcode,
    inventory_quantity: variant.inventory_quantity,
    variant_rank: variant.position,
    allow_backorder: variant.inventory_policy === "continue",
    manage_inventory: variant.inventory_management === "shopify", //if customer previously managed inventory either through Shopify or another fulfillment provider then true
    weight: variant.weight,
    options: normalizeVariantOptions(
      variant.option1,
      variant.option2,
      variant.option3
    ),
  }
}

function normalizePrices(presentment_prices) {
  return presentment_prices.map((p) => {
    return {
      amount: p.price.amount,
      currency_code: p.price.currency_code.toLowerCase(),
    }
  })
}

function normalizeVariantOptions(option1, option2, option3) {
  let opts = []
  if (option1) {
    opts.push({
      value: option1,
    })
  }

  if (option2) {
    opts.push({
      value: option2,
    })
  }

  if (option3) {
    opts.push({
      value: option3,
    })
  }

  return opts
}

function normalizeTag(tag) {
  return {
    value: tag,
  }
}

export function normalizeCollection(shopifyCollection) {
  return {
    title: shopifyCollection.title,
    handle: shopifyCollection.handle,
    metadata: {
      sh_id: shopifyCollection.id,
      sh_body_html: shopifyCollection.body_html,
    },
  }
}

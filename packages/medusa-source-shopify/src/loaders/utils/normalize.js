export function normalizeProduct(shopifyProduct) {
  return {
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: normalizeDescription(shopifyProduct.body_html),
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

function normalizeDescription(description) {
  return description.replace(/<[^>]+>/g, "")
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
    prices: [{ amount: variant.price, currency_code: "eur" }], //what to do here? price does not contain currency_code
    sku: variant.sku,
    barcode: variant.barcode,
    upc: variant.barcode,
    inventory_quantity: variant.inventory_quantity,
    variant_rank: variant.position,
    allow_backorder: variant.inventory_policy === "continue" ? true : false,
    manage_inventory: variant.inventory_management === "shopify",
    weight: variant.weight,
    options: normalizeVariantOptions(
      variant.option1,
      variant.option2,
      variant.option3
    ),
  }
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
  return {}
}

export function extractRegionOptions(
  regions: any[] | undefined
): { label: string; value: string; currency: string }[] {
  if (!regions) {
    return []
  }

  return regions.map((region) => ({
    label: region.name,
    value: region.id,
    currency: region.currency_code,
  }))
}

export function extractProductOptions(
  products: any[] | undefined
): { label: string; value: string }[] {
  if (!products) {
    return []
  }

  return products.map((product) => ({
    label: product.title,
    value: product.id,
  }))
}

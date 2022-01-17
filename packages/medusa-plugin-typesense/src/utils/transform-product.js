const variantKeys = [
  "sku",
  "title",
  "upc",
  "ean",
  "mid_code",
  "hs_code",
  "options",
]

export const transformProduct = (product) => {
  return {
    ...product,
  }
}

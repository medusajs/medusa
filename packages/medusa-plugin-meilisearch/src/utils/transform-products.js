const keys = ["sku", "title", "upc", "ean", "mid_code", "hs_code"]
const prefix = `variant`

export const transformProduct = (product) => {
  const initialObj = keys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = []
    return obj
  }, {})

  const flattenedFields = product.variants.reduce((obj, variant) => {
    keys.forEach((k) => variant[k] && obj[`${prefix}_${k}`].push(variant[k]))
    return obj
  }, initialObj)

  return {
    ...product,
    ...flattenedFields,
  }
}

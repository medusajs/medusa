const variantKeys = ["sku", "title", "upc", "ean", "mid_code", "hs_code"]
const prefix = `variant`

export const transformProduct = (product) => {
  const initialObj = variantKeys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = []
    return obj
  }, {})

  const flattenedVariantFields = product.variants.reduce((obj, variant) => {
    variantKeys.forEach(
      (k) => variant[k] && obj[`${prefix}_${k}`].push(variant[k])
    )
    return obj
  }, initialObj)

  product.type_value = product.type && product.type.value
  product.collection_title = product.collection && product.collection.title
  product.tags_value = product.tags.map((t) => t.value)

  return {
    ...product,
    ...flattenedVariantFields,
  }
}

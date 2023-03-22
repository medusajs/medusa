import { variantKeys } from "@medusajs/types"

const prefix = `variant`

export const transformProduct = (product: any) => {
  let transformedProduct = { ...product } as Record<string, unknown>

  const initialObj = variantKeys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = []
    return obj
  }, {})
  initialObj[`${prefix}_options_value`] = []

  const flattenedVariantFields = product.variants.reduce((obj, variant) => {
    variantKeys.forEach((k) => {
      if (k === "options" && variant[k]) {
        const values = variant[k].map((option) => option.value)
        obj[`${prefix}_options_value`] =
          obj[`${prefix}_options_value`].concat(values)
        return
      }
      return variant[k] && obj[`${prefix}_${k}`].push(variant[k])
    })
    return obj
  }, initialObj)

  transformedProduct.objectID = product.id
  transformedProduct.type_value = product.type && product.type.value
  transformedProduct.collection_title =
    product.collection && product.collection.title
  transformedProduct.collection_handle =
    product.collection && product.collection.handle
  transformedProduct.tags_value = product.tags
    ? product.tags.map((t) => t.value)
    : []
  transformedProduct.categories = (product?.categories || []).map((c) => c.name)

  const prod = {
    ...transformedProduct,
    ...flattenedVariantFields,
  }

  return prod
}

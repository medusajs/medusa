export const flattenSkus = (product) => {
  const skus = product.variants.map((v) => v.sku).filter(Boolean)
  product.sku = skus
  return product
}

export const defaultProductFields = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
  "origin_country",
  "created_at",
  "updated_at",
]

export const defaultProductRelations = [
  "variants",
  "tags",
  "type",
  "collection",
]

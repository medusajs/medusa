const checkContentTypes = async (container) => {
  const contentfulService = container.resolve("contentfulService")

  let product
  let variant

  try {
    product = await contentfulService.getType("product")
    variant = await contentfulService.getType("productVariant")
  } catch (error) {
    if (!product) {
      throw Error("Content type: `product` is missing in Contentful")
    }
    if (!variant) {
      throw Error("Content type: `productVariant` is missing in Contentful")
    }
  }

  if (product && product.fields) {
    const productFields = product.fields

    const keys = Object.values(productFields).map((f) => f.id)
    if (!requiredProductFields.every((f) => keys.includes(f))) {
      throw Error(
        `Contentful: Content type ${`product`} is missing some required key(s). Required: ${requiredProductFields.join(
          ", "
        )}`
      )
    }
  }

  if (variant && variant.fields) {
    const variantFields = variant.fields

    const keys = Object.values(variantFields).map((f) => f.id)
    if (!requiredVariantFields.every((f) => keys.includes(f))) {
      throw Error(
        `Contentful: Content type ${`productVariant`} is missing some required key(s). Required: ${requiredVariantFields.join(
          ", "
        )}`
      )
    }
  }
}

const requiredProductFields = [
  "title",
  "variants",
  "options",
  "objectId",
  "type",
  "collection",
  "tags",
  "handle",
]

const requiredVariantFields = ["title", "sku", "prices", "options", "objectId"]

export default checkContentTypes

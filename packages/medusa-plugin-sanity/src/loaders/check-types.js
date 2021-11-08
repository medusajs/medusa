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

    const customProductFields = Object.keys(
      contentfulService.options_.custom_product_fields || {}
    )
    const keys = Object.values(productFields).map((f) => f.id)

    const missingKeys = requiredProductFields.filter(
      (rpf) => !keys.includes(rpf) && !customProductFields.includes(rpf)
    )

    if (missingKeys.length) {
      throw Error(
        `Contentful: Content type ${`product`} is missing some required key(s). Required: ${requiredProductFields.join(
          ", "
        )}`
      )
    }
  }

  if (variant && variant.fields) {
    const variantFields = variant.fields

    const customVariantFields = Object.keys(
      contentfulService.options_.custom_variant_fields || {}
    )
    const keys = Object.values(variantFields).map((f) => f.id)

    const missingKeys = requiredVariantFields.filter(
      (rpf) => !keys.includes(rpf) && !customVariantFields.includes(rpf)
    )

    if (missingKeys.length) {
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
  "medusaId",
  "type",
  "collection",
  "tags",
  "handle",
]

const requiredVariantFields = ["title", "sku", "prices", "options", "medusaId"]

export default checkContentTypes

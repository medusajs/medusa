const checkContentTypes = async (container) => {
  const datoCMSService = container.resolve("datoCMSService")

  let product
  let variant

  try {
    product = await datoCMSService.getType("product")
    variant = await datoCMSService.getType("productVariant")
    region = await datoCMSService.getType("region")
  } catch (error) {
    if (!product) {
      throw Error("Content type: `product` is missing in DatoCMS")
    }

    if (!variant) {
      throw Error("Content type: `productVariant` is missing in DatoCMS")
    }
    
    if (!region) {
      throw Error("Content type: `region` is missing in DatoCMS")
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

  if (region && region.fields) {
    const regionFields = region.fields

    const customRegionFields = Object.keys(
      datoCMSService.options_.custom_region_fields || {}
    )

    const keys = Object.values(regionFields).map((f) => f.id)

    const missingKeys = requiredRegionFields.filter(
      (rpf) => !keys.includes(rpf) && !customRegionFields.includes(rpf)
    )

    if (missingKeys.length) {
      throw Error(
        `Contentful: Content type ${`region`} is missing some required key(s). Required: ${requiredRegionFields.join(
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

const requiredRegionFields = [
  "name",
  "currency_code",
  "tax_code",
  "tax_rate",
  "payment_providers",
  "fulfillment_providers",
  "countries",
]

export default checkContentTypes

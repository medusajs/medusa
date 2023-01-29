const requiredProductFields = [
  "title",
  "variants",
  "options",
  "medusa_id",
  "type",
  "collection",
  "tags",
  "handle",
]

const requiredVariantFields = ["title", "sku", "prices", "options", "medusa_id"]

const checkFields = async (datoCMSService, fields, type, requiredFields) => {
  let _fields = []
  try {
    _fields = await Promise.all(fields.map((f) => datoCMSService.fields.find(f)))
  } catch (error) {
    throw Error(`Error on read fields for ${type} model DatoCMS`)
  }
  const keys = Object.values(_fields).map((f) => f.api_key)
  const customFields = Object.keys(
    datoCMSService.options_[`custom_${type}_fields`] || {}
  )
  const missingKeys = requiredFields.filter(
    (rpf) => !keys.includes(rpf) && !customFields.includes(rpf)
  )

  if (missingKeys.length) {
    throw Error(
      `DatoCMS: Content type '${type}' is missing some required key(s). Required: ${requiredProductFields.join(
        ", "
      )}`
    )
  }
}

const checkModelTypes = async (container) => {
  const datoCMSService = container.resolve("datoCMSService")

  let product
  let variant

  try {
    product = await datoCMSService.getModel("product")
    variant = await datoCMSService.getModel("product_variant")
  } catch (error) {
    if (!product) {
      throw Error("Content type: `product` is missing in DatoCMS")
    }

    if (!variant) {
      throw Error("Content type: `product_variant` is missing in DatoCMS")
    }
  }

  await checkFields(datoCMSService, product.fields, "product", requiredProductFields)
  await checkFields(datoCMSService, variant.fields, "product_variant", requiredVariantFields)
}

export default checkModelTypes

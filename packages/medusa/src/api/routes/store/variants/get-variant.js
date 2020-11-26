import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { variant_id } = req.params

  const schema = Validator.objectId()
  const { value, error } = schema.validate(variant_id)

  if (error) {
    throw error
  }

  const variantService = req.scope.resolve("productVariantService")
  let variant = await variantService.retrieve(value)

  let includeFields = [
    "title",
    "prices",
    "sku",
    "ean",
    "image",
    "inventory_quantity",
    "allow_backorder",
    "manage_inventory",
  ]
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
  }
  variant = await variantService.decorate(variant, includeFields)
  res.json({ variant })
}

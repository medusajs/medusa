import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { variant_id } = req.params

  const schema = Validator.objectId()
  const { value, error } = schema.validate(variant_id)

  if (error) {
    throw error
  }

  const variantService = req.scope.resolve("productVariantService")
  let variant = await variantService.retrieve(value, "prices")
  res.json({ variant })
}

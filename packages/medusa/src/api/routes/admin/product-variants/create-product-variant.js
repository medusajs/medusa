import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    prices: Validator.array()
      .items({})
      .required(),
    options: Validator.array().items({}),
    image: Validator.string().optional(),
    inventory_quantity: Validator.number().optional(),
    allow_backorder: Validator.boolean().optional(),
    manage_inventory: Validator.boolean().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productVariantService = req.scope.resolve("productVariantService")
    const productVariant = await productVariantService.createDraft(value)

    res.status(200).json(productVariant)
  } catch (err) {
    throw err
  }
}

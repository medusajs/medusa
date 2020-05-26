import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    prices: Validator.array()
      .items({
        currency_code: Validator.string().required(),
        amount: Validator.number().required(),
      })
      .required(),
    options: Validator.array().items({
      option_id: Validator.objectId().required(),
      value: Validator.string().required(),
    }),
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
    const productService = req.scope.resolve("productService")
    const product = await productService.createVariant(id, value)
    const data = await productService.decorate(product, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "variants",
      "published",
    ])
    res.json(data)
  } catch (err) {
    throw err
  }
}

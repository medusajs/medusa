import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string(),
    description: Validator.string().optional(),
    tags: Validator.string().optional(),
    handle: Validator.string(),
    images: Validator.array()
      .items(Validator.string())
      .optional(),
    variants: Validator.array()
      .items({
        _id: Validator.string(),
        title: Validator.string().optional(),
        sku: Validator.string().optional(),
        ean: Validator.string().optional(),
        prices: Validator.array().items(
          Validator.object()
            .keys({
              region_id: Validator.string(),
              currency_code: Validator.string(),
              amount: Validator.number().required(),
            })
            .xor("region_id", "currency_code")
        ),
        options: Validator.array().items({
          option_id: Validator.objectId().required(),
          value: Validator.alternatives(
            Validator.string(),
            Validator.number()
          ).required(),
        }),
        inventory_quantity: Validator.number().optional(),
        allow_backorder: Validator.boolean().optional(),
        manage_inventory: Validator.boolean().optional(),
        metadata: Validator.object().optional(),
      })
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const oldProduct = await productService.retrieve(id)
    await productService.update(oldProduct._id, value)
    let newProduct = await productService.retrieve(oldProduct._id)
    newProduct = await productService.decorate(
      newProduct,
      [
        "title",
        "description",
        "tags",
        "handle",
        "images",
        "options",
        "published",
      ],
      ["variants"]
    )
    res.json({ product: newProduct })
  } catch (err) {
    throw err
  }
}

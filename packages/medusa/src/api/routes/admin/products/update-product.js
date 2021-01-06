import { MedusaError, Validator } from "medusa-core-utils"
import { defaultExpandFields, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    description: Validator.string().optional(),
    tags: Validator.string().optional(),
    handle: Validator.string().optional(),
    images: Validator.array()
      .items(Validator.string())
      .optional()
      .optional(),
    thumbnail: Validator.string().optional(),
    variants: Validator.array()
      .items({
        id: Validator.string().required(),
        title: Validator.string().optional(),
        sku: Validator.string().optional(),
        ean: Validator.string().optional(),
        barcode: Validator.string().optional(),
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
          option_id: Validator.string().required(),
          value: Validator.alternatives(
            Validator.string(),
            Validator.number()
          ).required(),
        }),
        inventory_quantity: Validator.number().optional(),
        allow_backorder: Validator.boolean().optional(),
        manage_inventory: Validator.boolean().optional(),
        weight: Validator.number().optional(),
        length: Validator.number().optional(),
        height: Validator.number().optional(),
        width: Validator.number().optional(),
        origin_country: Validator.string().allow(""),
        mid_code: Validator.string().allow(""),
        material: Validator.string().allow(""),
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

    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      let product = await productService
        .withTransaction(manager)
        .update(id, value)

      product = await productService
        .withTransaction(manager)
        .decorate(product.id, defaultFields, defaultExpandFields)

      res.json({ product })
    })
  } catch (err) {
    throw err
  }
}

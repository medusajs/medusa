import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    description: Validator.string().optional(),
    tags: Validator.string().optional(),
    handle: Validator.string().optional(),
    weight: Validator.number().optional(),
    length: Validator.number().optional(),
    height: Validator.number().optional(),
    width: Validator.number().optional(),
    origin_country: Validator.string().allow(null, ""),
    mid_code: Validator.string().allow(null, ""),
    material: Validator.string().allow(null, ""),
    images: Validator.array()
      .items(Validator.string())
      .optional()
      .optional(),
    thumbnail: Validator.string().optional(),
    variants: Validator.array()
      .items({
        id: Validator.string().optional(),
        title: Validator.string().allow(null),
        sku: Validator.string().allow(null),
        ean: Validator.string().allow(null),
        barcode: Validator.string().allow(null),
        prices: Validator.array().items(
          Validator.object()
            .keys({
              region_id: Validator.string(),
              currency_code: Validator.string(),
              amount: Validator.number()
                .integer()
                .required(),
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
        inventory_quantity: Validator.number().allow(null),
        allow_backorder: Validator.boolean().allow(null),
        manage_inventory: Validator.boolean().allow(null),
        weight: Validator.number().optional(),
        length: Validator.number().optional(),
        height: Validator.number().optional(),
        width: Validator.number().optional(),
        hs_code: Validator.string()
          .optional()
          .allow(null, ""),
        origin_country: Validator.string().allow(null, ""),
        mid_code: Validator.string().allow(null, ""),
        material: Validator.string().allow(null, ""),
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

    await productService.update(id, value)

    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ product })
  } catch (err) {
    throw err
  }
}

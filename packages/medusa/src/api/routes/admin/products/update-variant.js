import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id, variant_id } = req.params
  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    sku: Validator.string().optional(),
    ean: Validator.string().optional(),
    barcode: Validator.string().optional(),
    prices: Validator.array().items(
      Validator.object()
        .keys({
          region_id: Validator.string(),
          currency_code: Validator.string(),
          amount: Validator.number()
            .integer()
            .required(),
          sale_amount: Validator.number().optional(),
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
    hs_code: Validator.string()
      .optional()
      .allow(null, ""),
    origin_country: Validator.string()
      .optional()
      .allow(null, ""),
    mid_code: Validator.string()
      .optional()
      .allow(null, ""),
    material: Validator.string()
      .optional()
      .allow(null, ""),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const productVariantService = req.scope.resolve("productVariantService")

    await productVariantService.update(variant_id, value)

    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })
    res.json({ product })
  } catch (err) {
    throw err
  }
}

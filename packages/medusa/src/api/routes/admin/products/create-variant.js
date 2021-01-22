import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().required(),
    sku: Validator.string().allow(""),
    ean: Validator.string().allow(""),
    upc: Validator.string().allow(""),
    barcode: Validator.string().allow(""),
    hs_code: Validator.string().allow(""),
    inventory_quantity: Validator.number().default(0),
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
    prices: Validator.array()
      .items(
        Validator.object()
          .keys({
            region_id: Validator.string(),
            currency_code: Validator.string().required(),
            amount: Validator.number()
              .integer()
              .required(),
            sale_amount: Validator.number().optional(),
          })
          .xor("region_id", "currency_code")
      )
      .required(),
    options: Validator.array()
      .items({
        option_id: Validator.string().required(),
        value: Validator.string().required(),
      })
      .default([]),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productVariantService = req.scope.resolve("productVariantService")
    const productService = req.scope.resolve("productService")

    await productVariantService.create(id, value)

    const product = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ product })
  } catch (err) {
    throw err
  }
}

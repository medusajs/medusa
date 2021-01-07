import { MedusaError, Validator } from "medusa-core-utils"

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
      .items({
        currency_code: Validator.string().required(),
        amount: Validator.number().required(),
      })
      .required(),
    options: Validator.array()
      .items({
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
    const productVariant = await productVariantService.create(id, value)

    res.json({ product_variant: productVariant })
  } catch (err) {
    throw err
  }
}

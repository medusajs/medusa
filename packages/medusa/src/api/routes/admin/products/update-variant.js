import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"

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
          amount: Validator.number().required(),
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
    origin_country: Validator.string().allow(""),
    mid_code: Validator.string().allow(""),
    material: Validator.string().allow(""),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productService = req.scope.resolve("productService")
    const productVariantService = req.scope.resolve("productVariantService")

    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      if (value.prices && value.prices.length) {
        for (const price of value.prices) {
          if (price.region_id) {
            await productVariantService
              .withTransaction(manager)
              .setRegionPrice(variant_id, price.region_id, price.amount)
          } else {
            await productVariantService
              .withTransaction(manager)
              .setCurrencyPrice(variant_id, price.currency_code, price.amount)
          }
        }
      }

      if (value.options && value.options.length) {
        for (const option of value.options) {
          await productService
            .withTransaction(manager)
            .updateOptionValue(id, variant_id, option.option_id, option.value)
        }
      }

      delete value.prices
      delete value.options

      if (!_.isEmpty(value)) {
        await productVariantService
          .withTransaction(manager)
          .update(variant_id, value)
      }

      const product = await productService.withTransaction(manager).retrieve(id)
      res.json({ product })
    })
  } catch (err) {
    throw err
  }
}

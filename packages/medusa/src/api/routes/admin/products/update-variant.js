import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, variant_id } = req.params
  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    sku: Validator.string(),
    ean: Validator.string(),
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
      option_id: Validator.objectId().required(),
      value: Validator.alternatives(
        Validator.string(),
        Validator.number()
      ).required(),
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
    const productVariantService = req.scope.resolve("productVariantService")

    if (value.prices && value.prices.length) {
      for (const price of value.prices) {
        if (price.region_id) {
          await productVariantService.setRegionPrice(
            variant_id,
            price.region_id,
            price.amount,
            price.sale_amount || undefined
          )
        } else {
          await productVariantService.setCurrencyPrice(
            variant_id,
            price.currency_code,
            price.amount,
            price.sale_amount || undefined
          )
        }
      }
    }

    if (value.options && value.options.length) {
      for (const option of value.options) {
        await productService.updateOptionValue(
          id,
          variant_id,
          option.option_id,
          option.value
        )
      }
    }

    delete value.prices
    delete value.options

    if (!_.isEmpty(value.metadata)) {
      for (let key of Object.keys(value.metadata)) {
        await productVariantService.setMetadata(
          variant_id,
          key,
          value.metadata[key]
        )
      }

      delete value.metadata
    }

    if (!_.isEmpty(value)) {
      await productVariantService.update(variant_id, value)
    }

    const product = await productService.retrieve(id)
    const data = await productService.decorate(
      product,
      [
        "title",
        "description",
        "tags",
        "handle",
        "images",
        "options",
        "thumbnail",
        "variants",
        "is_giftcard",
        "published",
      ],
      ["variants"]
    )
    res.json({ product: data })
  } catch (err) {
    throw err
  }
}

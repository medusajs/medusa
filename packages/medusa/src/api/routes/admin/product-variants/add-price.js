import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object()
    .keys({
      region_id: Validator.string(),
      currency_code: Validator.string(),
      amount: Validator.number().required(),
    })
    .xor("region_id", "currency_code")

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productVariantService = req.scope.resolve("productVariantService")

    if (value.region_id) {
      const productVariant = await productVariantService.setRegionPrice(
        id,
        value.region_id,
        value.amount
      )

      res.status(200).json(productVariant)
    } else {
      const productVariant = await productVariantService.setCurrencyPrice(
        id,
        value.currency_code,
        value.amount
      )

      res.status(200).json(productVariant)
    }
  } catch (err) {
    throw err
  }
}

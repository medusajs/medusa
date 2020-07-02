import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    region_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    data: Validator.object(),
    price: Validator.object().keys({
      type: Validator.string().required(),
      amount: Validator.number().optional(),
    }),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          value: Validator.number().required(),
        })
      )
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const data = await optionService.create(value)

    // Add to default shipping profile
    const { _id } = await shippingProfileService.retrieveDefault()
    await shippingProfileService.addProduct(_id, data._id)

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    console.log(err)
    throw err
  }
}

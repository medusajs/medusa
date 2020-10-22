import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    region_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    profile_id: Validator.string(),
    data: Validator.object().required(),
    price: Validator.object()
      .keys({
        type: Validator.string().required(),
        amount: Validator.number().optional(),
      })
      .required(),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          value: Validator.number().required(),
        })
      )
      .optional(),
    is_return: Validator.boolean().default(false),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    // Add to default shipping profile
    if (!value.profile_id) {
      const { _id } = await shippingProfileService.retrieveDefault()
      value.profile_id = _id
    }

    const data = await optionService.create(value)

    await shippingProfileService.addShippingOption(value.profile_id, data._id)

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}

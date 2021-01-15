import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    region_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    profile_id: Validator.string(),
    data: Validator.object().required(),
    price_type: Validator.string().required(),
    amount: Validator.number().optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          amount: Validator.number().required(),
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
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      // Add to default shipping profile
      if (!value.profile_id) {
        const { id } = await shippingProfileService
          .withTransaction(manager)
          .retrieveDefault()
        value.profile_id = id
      }

      const data = await optionService.withTransaction(manager).create(value)

      await shippingProfileService
        .withTransaction(manager)
        .addShippingOption(value.profile_id, data.id)
      res.status(200).json({ shipping_option: data })
    })
  } catch (err) {
    throw err
  }
}

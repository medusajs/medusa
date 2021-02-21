import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    region_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    profile_id: Validator.string(),
    data: Validator.object().required(),
    price_type: Validator.string().required(),
    amount: Validator.number()
      .integer()
      .optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          amount: Validator.number()
            .integer()
            .required(),
        })
      )
      .optional(),
    is_return: Validator.boolean().default(false),
    admin_only: Validator.boolean().default(false),
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
      const { id } = await shippingProfileService.retrieveDefault()
      value.profile_id = id
    }

    const result = await optionService.create(value)
    const data = await optionService.retrieve(result.id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}

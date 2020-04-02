import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { profile_id } = req.params
  const schema = Validator.object().keys({
    product_id: Validator.objectId().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.addProduct(profile_id, value.product_id)

    const data = profileService.retrieve(profile_id)
    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

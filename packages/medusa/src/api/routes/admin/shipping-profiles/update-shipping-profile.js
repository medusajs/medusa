import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { profile_id } = req.params

  const schema = Validator.object().keys({
    name: Validator.string(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.update(profile_id, value)

    const data = await profileService.retrieve(profile_id)
    res.status(200).json({ shipping_profile: data })
  } catch (err) {
    throw err
  }
}

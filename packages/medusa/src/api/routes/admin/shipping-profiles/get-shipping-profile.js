import { defaultFields, defaultRelations } from "./"
export default async (req, res) => {
  const { profile_id } = req.params
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    const profile = await profileService.retrieve(profile_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_profile: profile })
  } catch (err) {
    throw err
  }
}

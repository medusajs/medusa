export default async (req, res) => {
  const { profile_id } = req.params
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    const data = await profileService.retrieve(profile_id)

    res.status(200).json({ shipping_profile: data })
  } catch (err) {
    throw err
  }
}

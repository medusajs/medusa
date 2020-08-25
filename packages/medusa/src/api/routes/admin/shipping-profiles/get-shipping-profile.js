export default async (req, res) => {
  const { profile_id } = req.params
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    const data = await profileService.retrieve(profile_id)

    const profile = await profileService.decorate(
      data,
      ["name"],
      ["products", "shipping_options"]
    )

    res.status(200).json({ shipping_profile: profile })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  const { profile_id, option_id } = req.params

  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.removeShippingOption(profile_id, option_id)

    const data = profileService.retrieve(profile_id)
    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

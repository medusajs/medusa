export default async (req, res) => {
  const { profile_id } = req.params
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.delete(profile_id)

    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}

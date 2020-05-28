export default async (req, res) => {
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    const data = await profileService.list()

    res.status(200).json({ shipping_profiles: data })
  } catch (err) {
    throw err
  }
}

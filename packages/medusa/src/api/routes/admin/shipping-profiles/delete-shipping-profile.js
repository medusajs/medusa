export default async (req, res) => {
  const { profile_id } = req.params
  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.delete(profile_id)

    res.status(200).json({
      id: profile_id,
      object: "shipping_profile",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

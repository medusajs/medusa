export default async (req, res) => {
  const { profile_id, product_id } = req.params

  try {
    const profileService = req.scope.resolve("shippingProfileService")

    await profileService.removeProduct(profile_id, product_id)

    const data = profileService.retrieve(profile_id)
    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

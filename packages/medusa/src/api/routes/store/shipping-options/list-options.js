export default async (req, res) => {
  const regionId = req.query.region_id

  try {
    const shippingOptionService = req.scope.resolve("shippingOptionService")

    const options = await shippingOptionService.list(
      {
        region_id: regionId,
      },
      {
        relations: ["requirements"],
      }
    )

    res.status(200).json({ shipping_options: options })
  } catch (err) {
    throw err
  }
}

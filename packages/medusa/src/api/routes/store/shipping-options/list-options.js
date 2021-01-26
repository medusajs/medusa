export default async (req, res) => {
  const productIds =
    (req.query.product_ids && req.query.product_ids.split(",")) || []
  const regionId = req.query.region_id

  try {
    const productService = req.scope.resolve("productService")
    const shippingOptionService = req.scope.resolve("shippingOptionService")

    const query = {}

    if (regionId) {
      query.region_id = regionId
    }

    if (productIds.length) {
      const prods = await productService.list({ id: productIds })
      query.profile_id = prods.map(p => p.profile_id)
    }

    const options = await shippingOptionService.list(query, {
      relations: ["requirements"],
    })

    res.status(200).json({ shipping_options: options })
  } catch (err) {
    throw err
  }
}

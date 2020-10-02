import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const productIds =
    (req.query.product_ids && req.query.product_ids.split(",")) || []
  const regionId = req.query.region_id

  try {
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const options = await shippingProfileService.fetchOptionsByProductIds(
      productIds,
      {
        region_id: regionId,
      }
    )

    res.status(200).json({ shipping_options: options })
  } catch (err) {
    throw err
  }
}

/**
 * @oas [get] /shipping-options
 * operationId: GetShippingOptions
 * summary: Retrieve Shipping Options
 * description: "Retrieves a list of Shipping Options."
 * parameters:
 *   - (query) product_ids {string} A comma separated list of Product ids to filter Shipping Options by.
 *   - (query) region_id {string} the Region to retrieve Shipping Options from.
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_options:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_option"
 */
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

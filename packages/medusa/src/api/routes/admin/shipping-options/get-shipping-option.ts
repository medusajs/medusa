/**
 * @oas [get] /shipping-options/{id}
 * operationId: "GetShippingOptionsOption"
 * summary: "Retrieve a Shipping Option"
 * description: "Retrieves a Shipping Option."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Shipping Option.
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_option:
 *               $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const { option_id } = req.params
  const optionService = req.scope.resolve("shippingOptionService")
  const data = await optionService.retrieve(option_id)

  res.status(200).json({ shipping_option: data })
}

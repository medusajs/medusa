/**
 * @oas [get] /swaps/{cart_id}
 * operationId: GetSwapsSwapCartId
 * summary: Retrieve Swap by Cart id
 * description: "Retrieves a Swap by the id of the Cart used to confirm the Swap."
 * parameters:
 *   - (path) cart_id {string} The id of the Cart
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swap:
 *               $ref: "#/components/schemas/swap"
 */
export default async (req, res) => {
  const { cart_id } = req.params

  try {
    const swapService = req.scope.resolve("swapService")
    const swap = await swapService.retrieveByCartId(cart_id)
    res.json({ swap })
  } catch (error) {
    throw error
  }
}

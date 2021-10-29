import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /carts/{id}/payment-sessions
 * operationId: "PostCartsCartPaymentSessions"
 * summary: "Initialize Payment Sessions"
 * description: "Creates Payment Sessions for each of the available Payment Providers in the Cart's Region."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.setPaymentSessions(id)

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

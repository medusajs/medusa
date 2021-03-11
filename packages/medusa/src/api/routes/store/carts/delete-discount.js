import { defaultFields, defaultRelations } from "./"

/**
 * @oas [delete] /carts/{id}/discounts/{code}
 * operationId: DeleteCartsCartDiscountsDiscount
 * description: "Removes a Discount from a Cart."
 * summary: "Remove Discount from Cart"
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) code=* {string} The unique Discount code.
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
  const { id, code } = req.params

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")

    await manager.transaction(async m => {
      // Remove the discount
      await cartService.withTransaction(m).removeDiscount(id, code)

      // If the cart has payment sessions update these
      const updated = await cartService.withTransaction(m).retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length) {
        await cartService.withTransaction(m).setPaymentSessions(id)
      }
    })

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

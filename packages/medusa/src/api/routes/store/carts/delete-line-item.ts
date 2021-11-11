import { EntityManager } from "typeorm"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"

/**
 * @oas [delete] /carts/{id}/line-items/{line_id}
 * operationId: DeleteCartsCartLineItemsItem
 * summary: Delete a Line Item
 * description: "Removes a Line Item from a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) line_id=* {string} The id of the Line Item.
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
  const { id, line_id } = req.params

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve("cartService")

  await manager.transaction(async (m) => {
    // Remove the line item
    await cartService.withTransaction(m).removeLineItem(id, line_id)

    // If the cart has payment sessions update these
    const updated = await cartService.withTransaction(m).retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await cartService.withTransaction(m).setPaymentSessions(id)
    }
  })

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}

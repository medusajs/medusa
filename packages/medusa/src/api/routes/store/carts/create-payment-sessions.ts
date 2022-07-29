import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import { EntityManager } from "typeorm"

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

  const cartService: CartService = req.scope.resolve("cartService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService
      .withTransaction(transactionManager)
      .setPaymentSessions(id)
  })

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  const data = await decorateLineItemsWithTotals(cart, req)
  res.status(200).json({ cart: data })
}

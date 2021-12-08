import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
} from "."
import { DraftOrder } from "../../../.."
import { CartService, DraftOrderService } from "../../../../services"
/**
 * @oas [delete] /draft-orders/{id}/line-items/{line_id}
 * operationId: DeleteDraftOrdersDraftOrderLineItemsItem
 * summary: Delete a Line Item
 * description: "Removes a Line Item from a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
 *   - (path) line_id=* {string} The id of the Draft Order.
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
 */

export default async (req, res) => {
  const { id, line_id } = req.params

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const draftOrder: DraftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id, { select: defaultAdminDraftOrdersFields })

    if (draftOrder.status === "completed") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are only allowed to update open draft orders"
      )
    }

    await cartService
      .withTransaction(manager)
      .removeLineItem(draftOrder.cart_id, line_id)

    draftOrder.cart = await cartService
      .withTransaction(manager)
      .retrieve(draftOrder.cart_id, {
        relations: defaultAdminDraftOrdersCartRelations,
        select: defaultAdminDraftOrdersCartFields,
      })

    res.status(200).json({ draft_order: draftOrder })
  })
}

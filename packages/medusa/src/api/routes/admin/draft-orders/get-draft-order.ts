import {
  defaultAdminDraftOrdersRelations,
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersCartFields,
} from "."
import { DraftOrder } from "../../../.."
import { CartService, DraftOrderService } from "../../../../services"

/**
 * @oas [get] /draft-orders/{id}
 * operationId: "GetDraftOrdersDraftOrder"
 * summary: "Retrieve a Draft Order"
 * description: "Retrieves a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Draft Order.
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
  const { id } = req.params

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")

  const draftOrder: DraftOrder = await draftOrderService.retrieve(id, {
    select: defaultAdminDraftOrdersFields,
    relations: defaultAdminDraftOrdersRelations,
  })

  draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
    relations: defaultAdminDraftOrdersCartRelations,
    select: defaultAdminDraftOrdersCartFields,
  })

  res.json({ draft_order: draftOrder })
}

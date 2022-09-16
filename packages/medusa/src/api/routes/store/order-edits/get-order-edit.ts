import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"

/**
 * @oas [get] /order-edits/{id}
 * operationId: "GetOrderEditsOrderEdit"
 * summary: "Retrieve an OrderEdit"
 * description: "Retrieves a OrderEdit."
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orderEdit.retrieve(orderEditId)
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/order-edits/{id}'
 * tags:
 *   - OrderEdit
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order_edit:
 *               $ref: "#/components/schemas/order_edit"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const { id } = req.params
  const retrieveConfig = req.retrieveConfig

  const orderEdit = await orderEditService.retrieve(id, retrieveConfig)

  const { items, removedItems } = await orderEditService.computeLineItems(id)
  orderEdit.items = items
  orderEdit.removed_items = removedItems

  const totals = await orderEditService.getTotals(orderEdit.id)
  orderEdit.discount_total = totals.discount_total
  orderEdit.gift_card_total = totals.gift_card_total
  orderEdit.gift_card_tax_total = totals.gift_card_tax_total
  orderEdit.shipping_total = totals.shipping_total
  orderEdit.subtotal = totals.subtotal
  orderEdit.tax_total = totals.tax_total
  orderEdit.total = totals.total

  return res.json({ order_edit: orderEdit })
}

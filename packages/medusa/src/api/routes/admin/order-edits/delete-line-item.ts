import { EntityManager } from "typeorm"
import { OrderEditService } from "../../../../services"
import { Request, Response } from "express"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"

/**
 * @oas [delete] /admin/order-edits/{id}/items/{item_id}
 * operationId: "DeleteOrderEditsOrderEditLineItemsLineItem"
 * summary: "Delete Line Item"
 * description: "Create a line item change in the order edit that indicates deleting an item in the original order. The item in the original order will not be deleted until the order edit is
 *  confirmed."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order Edit.
 *   - (path) item_id=* {string} The ID of line item in the original order.
 * x-codegen:
 *   method: removeLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdits.removeLineItem(orderEditId, lineItemId)
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/order-edits/{id}/items/{item_id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Order Edits
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderEditsRes"
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
  const { id, item_id } = req.params

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await orderEditService
      .withTransaction(transactionManager)
      .removeLineItem(id, item_id)
  })

  let orderEdit = await orderEditService.retrieve(id, {
    select: defaultOrderEditFields,
    relations: defaultOrderEditRelations,
  })
  orderEdit = await orderEditService.decorateTotals(orderEdit)

  res.status(200).send({
    order_edit: orderEdit,
  })
}

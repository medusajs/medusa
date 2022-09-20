import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { OrderEditService } from "../../../../services"

/**
 * @oas [post] /order-edits/{id}
 * operationId: "PostOrderEditsOrderEdit"
 * summary: "Updates an OrderEdit"
 * description: "Updates a OrderEdit."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the OrderEdit.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       const params = {internal_note: "internal reason XY"}
 *       medusa.admin.orderEdit.update(orderEditId, params)
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "internal_note": "internal reason XY"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostOrderEditsOrderEditReq
  }

  const orderEditService: OrderEditService =
    req.scope.resolve("orderEditService")

  const manager: EntityManager = req.scope.resolve("manager")

  const orderEdit = await manager.transaction(async (transactionManager) => {
    const orderEditServiceTx =
      orderEditService.withTransaction(transactionManager)

    const _orderEdit = await orderEditServiceTx.update(id, validatedBody)

    const { items } = await orderEditServiceTx.computeLineItems(_orderEdit.id)
    _orderEdit.items = items

    const totals = await orderEditServiceTx.getTotals(_orderEdit.id)
    _orderEdit.discount_total = totals.discount_total
    _orderEdit.gift_card_total = totals.gift_card_total
    _orderEdit.gift_card_tax_total = totals.gift_card_tax_total
    _orderEdit.shipping_total = totals.shipping_total
    _orderEdit.subtotal = totals.subtotal
    _orderEdit.tax_total = totals.tax_total
    _orderEdit.total = totals.total

    return _orderEdit
  })

  res.status(200).json({ order_edit: orderEdit })
}

export class AdminPostOrderEditsOrderEditReq {
  @IsOptional()
  @IsString()
  internal_note?: string
}

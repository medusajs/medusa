import { Request, Response } from "express"
import { OrderEditService } from "../../../../services"
import { IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /order-edits
 * operationId: "PostOrderEdits"
 * summary: "Create an OrderEdit"
 * description: "Created a OrderEdit."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orderEdit.create({ order_id, internal_note })
 *       .then(({ order_edit }) => {
 *         console.log(order_edit.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/order-edits' \
 *       --header 'Authorization: Bearer {api_token}'
 *       -d '{ "order_id": "my_order_id", "internal_note": "my_optional_note" }'
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
  const orderEditService = req.scope.resolve(
    "orderEditService"
  ) as OrderEditService
  const manager = req.scope.resolve("manager") as EntityManager

  const data = req.validatedBody as AdminPostOrderEditsReq
  const loggedInUserId = (req.user?.id ?? req.user?.userId) as string

  const orderEdit = await manager.transaction(async (transactionManager) => {
    const orderEditServiceTx =
      orderEditService.withTransaction(transactionManager)
    const orderEdit = await orderEditServiceTx.create(data, { loggedInUserId })

    const { items } = await orderEditServiceTx.computeLineItems(orderEdit.id)
    orderEdit.items = items
    orderEdit.removed_items = []

    const totals = await orderEditServiceTx.getTotals(orderEdit.id)
    orderEdit.discount_total = totals.discount_total
    orderEdit.gift_card_total = totals.gift_card_total
    orderEdit.gift_card_tax_total = totals.gift_card_tax_total
    orderEdit.shipping_total = totals.shipping_total
    orderEdit.subtotal = totals.subtotal
    orderEdit.tax_total = totals.tax_total
    orderEdit.total = totals.total

    return orderEdit
  })

  return res.json({ order_edit: orderEdit })
}

export class AdminPostOrderEditsReq {
  @IsString()
  order_id: string

  @IsOptional()
  @IsString()
  internal_note?: string
}

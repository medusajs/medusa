import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"

import { OrderService } from "../../../../services"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /orders/{id}/refund
 * operationId: "PostOrdersOrderRefunds"
 * summary: "Create a Refund"
 * description: "Issues a Refund."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma separated list of relations to include in the result.
 *   - (query) fields {string} Comma separated list of fields to include in the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderRefundsReq"
 * x-codegen:
 *   method: refundPayment
 *   params: AdminPostOrdersOrderRefundsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.refundPayment(order_id, {
 *         amount: 1000,
 *         reason: 'Do not like it'
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/adasda/refund' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "amount": 1000,
 *           "reason": "Do not like it"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
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
export default async (req, res) => {
  const { id } = req.params

  const validated = req.validatedBody

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .createRefund(id, validated.amount, validated.reason, validated.note, {
        no_notification: validated.no_notification,
      })
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.status(200).json({ order })
}

/**
 * @schema AdminPostOrdersOrderRefundsReq
 * type: object
 * required:
 *   - amount
 *   - reason
 * properties:
 *   amount:
 *     description: The amount to refund.
 *     type: integer
 *   reason:
 *     description: The reason for the Refund.
 *     type: string
 *   note:
 *     description: A note with additional details about the Refund.
 *     type: string
 *   no_notification:
 *     description: If set to true no notification will be send related to this Refund.
 *     type: boolean
 */
export class AdminPostOrdersOrderRefundsReq {
  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  note?: string

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

export class AdminPostOrdersOrderRefundsParams extends FindParams {}

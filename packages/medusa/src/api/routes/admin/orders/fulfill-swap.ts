import { IsBoolean, IsObject, IsOptional } from "class-validator"
import { OrderService, SwapService } from "../../../../services"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { EntityManager } from "typeorm"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/fulfillments
 * operationId: "PostOrdersOrderSwapsSwapFulfillments"
 * summary: "Create a Swap Fulfillment"
 * description: "Creates a Fulfillment for a Swap."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (path) swap_id=* {string} The ID of the Swap.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 *           no_notification:
 *             description: If set to true no notification will be send related to this Claim.
 *             type: boolean
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.fulfillSwap(order_id, swap_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps/{swap_id}/fulfillments' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Fulfillment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
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
  const { id, swap_id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    await swapService.withTransaction(manager).createFulfillment(swap_id, {
      metadata: validated.metadata,
      no_notification: validated.no_notification,
    })
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

export class AdminPostOrdersOrderSwapsSwapFulfillmentsReq {
  @IsObject()
  @IsOptional()
  metadata?: object

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

import {
  FulfillmentService,
  OrderService,
  SwapService,
} from "../../../../services"

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/fulfillments/{fulfillment_id}/cancel
 * operationId: "PostOrdersSwapFulfillmentsCancel"
 * summary: "Cancel Swap's Fulfilmment"
 * description: "Registers a Swap's Fulfillment as canceled."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order which the Swap relates to.
 *   - (path) swap_id=* {string} The ID of the Swap which the Fulfillment relates to.
 *   - (path) fulfillment_id=* {string} The ID of the Fulfillment.
 *   - (query) expand {string} Comma separated list of relations to include in the result.
 *   - (query) fields {string} Comma separated list of fields to include in the result.
 * x-codegen:
 *   method: cancelSwapFulfillment
 *   params: AdminPostOrdersSwapFulfillementsCancelParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.cancelSwapFulfillment(order_id, swap_id, fulfillment_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps/{swap_id}/fulfillments/{fulfillment_id}/cancel' \
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
  const { id, swap_id, fulfillment_id } = req.params

  const swapService: SwapService = req.scope.resolve("swapService")
  const orderService: OrderService = req.scope.resolve("orderService")
  const fulfillmentService: FulfillmentService =
    req.scope.resolve("fulfillmentService")

  const fulfillment = await fulfillmentService.retrieve(fulfillment_id)

  if (fulfillment.swap_id !== swap_id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no fulfillment was found with the id: ${fulfillment_id} related to swap: ${id}`
    )
  }

  const swap = await swapService.retrieve(swap_id)

  if (swap.order_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no swap was found with the id: ${swap_id} related to order: ${id}`
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await swapService
      .withTransaction(transactionManager)
      .cancelFulfillment(fulfillment_id)
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.json({ order })
}

// eslint-disable-next-line max-len
export class AdminPostOrdersOrderSwapFulfillementsCancelParams extends FindParams {}

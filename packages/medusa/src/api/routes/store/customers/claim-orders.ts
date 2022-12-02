import { IsNotEmpty, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { OrderService } from "../../../../services"

/**
 * @oas [post] /customers/claim-orders
 * operationId: "PostCustomersCustomerOrderClaim"
 * summary: "Claim orders for signed in account"
 * description: "Sends an email to emails registered to orders provided with link to transfer order ownership"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - order_ids
 *         properties:
 *           order_ids:
 *             description: "The ids of the orders to claim"
 *             type: array
 *             items:
 *              type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.customers.claimOrders({
 *         order_ids,
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // an error occurred
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/customers/claim-orders' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "order_ids": ["id"],
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Invite
 * responses:
 *   200:
 *     description: OK
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
  const { order_ids } = req.validatedBody

  const customerId: string = req.user?.customer_id

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await orderService
      .withTransaction(transactionManager)
      .claimOrdersForCustomerWithId(customerId, order_ids)
  })

  res.sendStatus(200)
}

export class StorePostCustomersCustomerOrderClaimReq {
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  order_ids: string[]
}

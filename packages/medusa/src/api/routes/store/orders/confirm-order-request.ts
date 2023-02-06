import { IsJWT, IsNotEmpty } from "class-validator"
import { EntityManager } from "typeorm"
import {
  CustomerService,
  OrderService,
  TokenService,
} from "../../../../services"

/**
 * @oas [post] /orders/customer/confirm
 * operationId: "PostOrdersCustomerOrderClaimsCustomerOrderClaimAccept"
 * summary: "Verify an Order Claim"
 * description: "Verifies the claim order token provided to the customer upon request of order ownership"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCustomersCustomerAcceptClaimReq"
 * x-codegen:
 *   method: confirmRequest
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.orders.confirmRequest(
 *         token,
 *       )
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // an error occurred
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/orders/customer/confirm' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "token": "{token}",
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order
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
  const { token } = req.validatedBody

  const orderSerivce: OrderService = req.scope.resolve("orderService")
  const customerService: CustomerService = req.scope.resolve("customerService")
  const tokenService: TokenService = req.scope.resolve(
    TokenService.RESOLUTION_KEY
  )

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    const { claimingCustomerId, orders: orderIds } = tokenService.verifyToken(
      token,
      {
        maxAge: "15m",
      }
    ) as {
      claimingCustomerId: string
      orders: string[]
    }

    const customer = await customerService
      .withTransaction(transactionManager)
      .retrieve(claimingCustomerId)

    const orders = await orderService.list({ id: orderIds })

    await Promise.all(
      orders.map(async (order) => {
        await orderSerivce
          .withTransaction(transactionManager)
          .update(order.id, {
            customer_id: claimingCustomerId,
            email: customer.email,
          })
      })
    )
  })

  res.sendStatus(200)
}

/**
 * @schema StorePostCustomersCustomerAcceptClaimReq
 * type: object
 * required:
 *   - token
 * properties:
 *   token:
 *     description: "The invite token provided by the admin."
 *     type: string
 */
export class StorePostCustomersCustomerAcceptClaimReq {
  @IsNotEmpty()
  @IsJWT()
  token: string
}

import { IsNotEmpty, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import { CustomerService, OrderService } from "../../../../services"
import EventBusService from "../../../../services/event-bus"
import TokenService from "../../../../services/token"
import { TokenEvents } from "../../../../types/token"

/**
 * @oas [post] /store/orders/batch/customer/token
 * operationId: "PostOrdersCustomerOrderClaim"
 * summary: "Claim an Order"
 * description: "Sends an email to emails registered to orders provided with link to transfer order ownership"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCustomersCustomerOrderClaimReq"
 * x-codegen:
 *   method: requestCustomerOrders
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.orders.claimOrders({
 *         display_ids,
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
 *       curl --location --request POST 'https://medusa-url.com/store/batch/customer/token' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "display_ids": ["id"],
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Orders
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

  const eventBusService: EventBusService = req.scope.resolve("eventBusService")
  const orderService: OrderService = req.scope.resolve("orderService")
  const customerService: CustomerService = req.scope.resolve("customerService")
  const tokenService: TokenService = req.scope.resolve(
    TokenService.RESOLUTION_KEY
  )

  const customerId: string = req.user?.customer_id
  const customer = await customerService.retrieve(customerId)

  if (!customer.has_account) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Customer does not have an account"
    )
  }

  const orders = await orderService.list(
    { id: order_ids },
    { select: ["id", "email"] }
  )

  const emailOrderMapping: { [email: string]: string[] } = orders.reduce(
    (acc, order) => {
      acc[order.email] = [...(acc[order.email] || []), order.id]
      return acc
    },
    {}
  )

  await Promise.all(
    Object.entries(emailOrderMapping).map(async ([email, order_ids]) => {
      const token = tokenService.signToken(
        {
          claimingCustomerId: customerId,
          orders: order_ids,
        },
        { expiresIn: "15m" }
      )

      await eventBusService.emit(TokenEvents.ORDER_UPDATE_TOKEN_CREATED, {
        old_email: email,
        new_customer_id: customer.id,
        orders: order_ids,
        token,
      })
    })
  )

  res.sendStatus(200)
}

/**
 * @schema StorePostCustomersCustomerOrderClaimReq
 * type: object
 * required:
 *   - order_ids
 * properties:
 *   order_ids:
 *     description: "The ids of the orders to claim"
 *     type: array
 *     items:
 *      type: string
 */
export class StorePostCustomersCustomerOrderClaimReq {
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  order_ids: string[]
}

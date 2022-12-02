import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator"

import InviteService from "../../../../services/invite"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import { CustomerService, OrderService } from "../../../../services"

/**
 * @oas [post] /customers/confirm-claim
 * operationId: "PostCustomersCustomerOrderClaimsOrderClaimAccept"
 * summary: "Verify a claim to orders"
 * description: "Verifies the claim order token provided to the customer upon request of order ownership"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - token
 *         properties:
 *           token:
 *             description: "The invite token provided by the admin."
 *             type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.customers.verify({
 *         token,
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
 *       curl --location --request POST 'https://medusa-url.com/store/customers/confirm-claim' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "token": "{token}",
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
  const { token } = req.validatedBody

  const customerId: string = req.user?.customer_id
  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await orderService
      .withTransaction(transactionManager)
      .confirmCustomerClaimToOrders(token, customerId)
  })

  res.sendStatus(200)
}

export class StorePostCustomersCustomerAcceptClaimReq {
  @IsNotEmpty()
  @IsJWT()
  token: string
}

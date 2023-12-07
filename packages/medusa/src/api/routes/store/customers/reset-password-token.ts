import CustomerService from "../../../../services/customer"
import { IsEmail } from "class-validator"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /store/customers/password-token
 * operationId: PostCustomersCustomerPasswordToken
 * summary: Request Password Reset
 * description: "Create a reset password token to be used in a subsequent Reset Password API Route. This emits the event `customer.password_reset`. If a notification provider is
 *  installed in the Medusa backend and is configured to handle this event, a notification to the customer, such as an email, may be sent with reset instructions."
 * externalDocs:
 *   description: "How to reset password"
 *   url: "https://docs.medusajs.com/modules/customers/storefront/implement-customer-profiles#reset-password"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCustomersCustomerPasswordTokenReq"
 * x-codegen:
 *   method: generatePasswordToken
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.customers.generatePasswordToken({
 *         email: "user@example.com"
 *       })
 *       .then(() => {
 *         // successful
 *       })
 *       .catch(() => {
 *         // failed
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/customers/password-token' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * tags:
 *   - Customers
 * responses:
 *   204:
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
  const validated = (await validator(
    StorePostCustomersCustomerPasswordTokenReq,
    req.body
  )) as StorePostCustomersCustomerPasswordTokenReq

  const customerService: CustomerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  const customer = await customerService
    .retrieveRegisteredByEmail(validated.email)
    .catch(() => undefined)

  if (customer) {
    // Will generate a token and send it to the customer via an email provider
    const manager: EntityManager = req.scope.resolve("manager")
    await manager.transaction(async (transactionManager) => {
      return await customerService
        .withTransaction(transactionManager)
        .generateResetPasswordToken(customer.id)
    })
  }

  res.sendStatus(204)
}

/**
 * @schema StorePostCustomersCustomerPasswordTokenReq
 * type: object
 * required:
 *   - email
 * properties:
 *   email:
 *     description: "The customer's email."
 *     type: string
 *     format: email
 */
export class StorePostCustomersCustomerPasswordTokenReq {
  @IsEmail()
  email: string
}

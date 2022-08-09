import CustomerService from "../../../../services/customer"
import { EntityManager } from "typeorm"
import { IsEmail } from "class-validator"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/password-token
 * operationId: PostCustomersCustomerPasswordToken
 * summary: Creates a reset password token
 * description: "Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *         properties:
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *             format: email
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.customers.generatePasswordToken({
 *         email: 'user@example.com'
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/customers/password-token' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * tags:
 *   - Customer
 * responses:
 *   204:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(
    StorePostCustomersCustomerPasswordTokenReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  const customer = await customerService.retrieveByEmail(validated.email)

  // Will generate a token and send it to the customer via an email provider
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .generateResetPasswordToken(customer.id)
  })

  res.sendStatus(204)
}

export class StorePostCustomersCustomerPasswordTokenReq {
  @IsEmail()
  email: string
}

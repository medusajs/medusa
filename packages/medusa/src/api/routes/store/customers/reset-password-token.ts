import { IsEmail } from "class-validator"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers/password-token
 * operationId: PostCustomersCustomerPasswordToken
 * summary: Creates a reset password token
 * description: "Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned."
 * parameters:
 *   - (body) email=* {string} Email of the user whose password should be reset.
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

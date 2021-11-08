import { IsEmail } from "class-validator"
import { validator } from "medusa-core-utils"
import { CustomerResponse } from "."
import CustomerService from "../../../../services/customer"

/**
 * @oas [post] /customers/password-token
 * operationId: PostCustomersCustomerPasswordToken
 * summary: Creates a reset password token
 * description: "Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned."
 * tags:
 *   - Customer
 * responses:
 *   204:
 *     description: OK
 */
export default async (req, res) => {
  const validated = await validator(StoreResetPasswordTokenRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
  const customer: CustomerResponse = await customerService.retrieveByEmail(
    validated.email
  )

  // Will generate a token and send it to the customer via an email provider
  await customerService.generateResetPasswordToken(customer.id)

  res.sendStatus(204)
}

export class StoreResetPasswordTokenRequest {
  @IsEmail()
  email: string
}

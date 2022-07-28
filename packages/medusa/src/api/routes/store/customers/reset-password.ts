import { IsEmail, IsString } from "class-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers/reset-password
 * operationId: PostCustomersResetPassword
 * summary: Resets Customer password
 * description: "Resets a Customer's password using a password token created by a previous /password-token request."
 * parameters:
 *   - (body) email=* {string} The Customer's email.
 *   - (body) token=* {string} The password token created by a /password-token request.
 *   - (body) password=* {string} The new password to set for the Customer.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const validated = await validator(
    StorePostCustomersResetPasswordReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve("customerService")
  let customer = await customerService.retrieveByEmail(validated.email, {
    select: ["id", "password_hash"],
  })

  const decodedToken = jwt.verify(
    validated.token,
    customer.password_hash
  ) as JwtPayload
  if (!decodedToken || customer.id !== decodedToken.customer_id) {
    res.status(401).send("Invalid or expired password reset token")
    return
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .update(customer.id, {
        password: validated.password,
      })
  })

  customer = await customerService.retrieve(customer.id)
  res.status(200).json({ customer })
}

export class StorePostCustomersResetPasswordReq {
  @IsEmail()
  email: string

  @IsString()
  token: string

  @IsString()
  password: string
}

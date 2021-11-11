import { IsEmail, IsString } from "class-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/reset-password.ts
=======
import { CustomerResponse } from "."
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/reset-password.js
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

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
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/reset-password.ts
  const validated = await validator(
    StorePostCustomersResetPasswordReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve("customerService")
=======
  const validated = await validator(StoreResetPasswordRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/reset-password.js
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

  await customerService.update(customer.id, {
    password: validated.password,
  })

  customer = await customerService.retrieve(customer.id)
  res.status(200).json({ customer })
}

<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/reset-password.ts
export class StorePostCustomersResetPasswordReq {
=======
export class StoreResetPasswordRequest {
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/reset-password.js
  @IsEmail()
  email: string
  @IsString()
  token: string
  @IsString()
  password: string
}
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/reset-password.ts
=======

export class StoreResetPasswordResponse {
  customer: CustomerResponse
}
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/reset-password.js

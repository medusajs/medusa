import jwt from "jsonwebtoken"
import { Validator } from "medusa-core-utils"
import config from "../../../../config"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate Customer"
 * description: "Logs a Customer in and authorizes them to view their details. Successful authentication will set a session cookie in the Customer's browser."
 * parameters:
 *   - (body) email=* {string} The Customer's email.
 *   - (body) password=* {string} The Customer's password.
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const { body } = req
  const schema = Validator.object().keys({
    email: Validator.string().required(),
    password: Validator.string().required(),
  })
  const { value, error } = schema.validate(body)

  if (error) {
    throw error
  }

  const authService = req.scope.resolve("authService")
  const customerService = req.scope.resolve("customerService")

  const result = await authService.authenticateCustomer(
    value.email,
    value.password
  )
  if (!result.success) {
    res.sendStatus(401)
    return
  }

  // Add JWT to cookie
  req.session.jwt = jwt.sign(
    { customer_id: result.customer.id },
    config.jwtSecret,
    {
      expiresIn: "30d",
    }
  )

  const customer = await customerService.retrieve(result.customer.id, {
    relations: ["orders", "orders.items"],
  })

  res.json({ customer })
}

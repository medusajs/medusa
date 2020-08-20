import jwt from "jsonwebtoken"
import { Validator } from "medusa-core-utils"
import config from "../../../../config"

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
    { customer_id: result.customer._id },
    config.jwtSecret,
    {
      expiresIn: "30d",
    }
  )

  const data = await customerService.decorate(
    result.customer,
    ["_id", "email", "orders", "shipping_addresses", "first_name", "last_name"],
    ["orders"]
  )

  res.json({ customer: data })
}

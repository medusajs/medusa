import jwt from "jsonwebtoken"
import { Validator, MedusaError } from "medusa-core-utils"
import config from "../../../../config"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    first_name: Validator.string().required(),
    last_name: Validator.string().required(),
    password: Validator.string().required(),
    phone: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.create(value)

    // Add JWT to cookie
    req.session.jwt = jwt.sign(
      { customer_id: customer._id },
      config.jwtSecret,
      {
        expiresIn: "30d",
      }
    )

    const data = await customerService.decorate(customer, [
      "_id",
      "email",
      "orders",
      "shipping_addresses",
      "first_name",
      "last_name",
      "phone",
    ])
    res.status(201).json({ customer: data })
  } catch (err) {
    throw err
  }
}

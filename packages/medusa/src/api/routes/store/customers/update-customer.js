import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    first_name: Validator.string().optional(),
    last_name: Validator.string().optional(),
    password: Validator.string().optional(),
    phone: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.update(id, value)
    const data = await customerService.decorate(
      customer,
      ["email", "first_name", "last_name", "shipping_addresses", "phone"],
      ["orders"]
    )
    res.status(200).json({ customer: data })
  } catch (err) {
    throw err
  }
}

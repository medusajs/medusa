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
    let customer = await customerService.update(id, value)

    customer = await customerService.retrieve(customer.id, {
      relations: ["orders", "shipping_addresses"],
    })

    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}

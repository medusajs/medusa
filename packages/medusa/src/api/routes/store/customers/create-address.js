import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, address_id } = req.params

  const schema = Validator.object().keys({
    address: Validator.address(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const customerService = req.scope.resolve("customerService")
  try {
    const customer = await customerService.addAddress(id, value.address)
    const data = await customerService.decorate(
      customer,
      ["email", "first_name", "last_name", "shipping_addresses"],
      ["orders"]
    )
    res.json({ customer: data })
  } catch (err) {
    throw err
  }
}

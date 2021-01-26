import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, address_id } = req.params

  const schema = Validator.object().keys({
    address: Validator.address().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const customerService = req.scope.resolve("customerService")
  try {
    let customer = await customerService.updateAddress(
      id,
      address_id,
      value.address
    )

    customer = await customerService.retrieve(id, {
      relations: ["orders", "shipping_addresses"],
    })

    res.json({ customer })
  } catch (err) {
    throw err
  }
}

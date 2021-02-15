import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    address: Validator.address().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")

    let customer = await customerService.addAddress(id, value.address)
    customer = await customerService.retrieve(id, {
      relations: ["shipping_addresses"],
    })

    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}

import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")

    await customerService.update(id, value)

    const customer = await customerService.retrieve(id)
    const data = await customerService.decorate(customer)
    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

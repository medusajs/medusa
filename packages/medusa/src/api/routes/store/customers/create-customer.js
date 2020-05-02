import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    first_name: Validator.string().required(),
    last_name: Validator.string().required(),
    password: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.create(value)

    const data = await customerService.decorate(customer)
    res.status(201).json(data)
  } catch (err) {
    throw err
  }
}

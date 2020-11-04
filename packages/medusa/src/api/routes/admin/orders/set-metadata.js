import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    key: Validator.string().required(),
    value: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.setMetadata(id, value.key, value.value)
    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

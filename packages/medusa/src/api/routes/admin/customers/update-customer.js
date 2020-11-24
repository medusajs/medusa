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
    const orderService = req.scope.resolve("orderService")
    const customerService = req.scope.resolve("customerService")
    await customerService.update(id, value)

    const customer = await customerService.retrieve(id)
    const data = await customerService.decorate(customer)
    data.orders = await Promise.all(
      customer.orders.map(async oId => {
        const order = await orderService.retrieve(oId)
        return orderService.decorate(order, [], [])
      })
    )
    res.status(200).json({ customer: data })
  } catch (err) {
    throw err
  }
}

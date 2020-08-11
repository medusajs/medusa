import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    email: Validator.string().email(),
    billing_address: Validator.address(),
    shipping_address: Validator.address(),
    items: Validator.array(),
    region: Validator.string(),
    discounts: Validator.array(),
    customer_id: Validator.string(),
    payment_method: Validator.object().keys({
      provider_id: Validator.string(),
      data: Validator.object(),
    }),
    shipping_method: Validator.array().items({
      provider_id: Validator.string(),
      profile_id: Validator.string(),
      price: Validator.number(),
      data: Validator.object(),
      items: Validator.array(),
    }),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.update(id, value)
    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

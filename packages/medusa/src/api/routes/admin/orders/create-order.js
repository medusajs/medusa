import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    status: Validator.string().optional(),
    email: Validator.string()
      .email()
      .required(),
    billing_address: Validator.address().required(),
    shipping_address: Validator.address().required(),
    items: Validator.array().required(),
    region: Validator.string().required(),
    discounts: Validator.array().optional(),
    customer_id: Validator.string().required(),
    payment_method: Validator.object()
      .keys({
        provider_id: Validator.string().required(),
        data: Validator.object().optional(),
      })
      .required(),
    shipping_method: Validator.array()
      .items({
        provider_id: Validator.string().required(),
        profile_id: Validator.string().required(),
        price: Validator.number().required(),
        data: Validator.object().optional(),
        items: Validator.array().optional(),
      })
      .required(),
    no_notification: Validator.boolean().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.create(value)
    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    billing_address: Validator.address().required(),
    shipping_address: Validator.address().required(),
    items: Validator.array().items({}),
    region: Validator.string().required(),
    discounts: Validator.array().optional(),
    customer_id: Validator.string().required(),
    payment_method: Validator.object().keys({
      provider_id: Validator.string().required(),
      data: Validator.object().optional(),
    }),
    shipping_method: Validator.array().items({
      provider_id: Validator.string().required(),
      profile_id: Validator.string().required(),
      data: Validator.object().optional(),
      items: Validator.array().optional(),
    }),
    return: Validator.boolean().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.create(value)

    res.status(200).json(order)
  } catch (err) {
    throw err
  }
}

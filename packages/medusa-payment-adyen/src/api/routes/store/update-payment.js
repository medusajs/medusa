import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    payment_data: Validator.object().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const paymentProvider = req.scope.resolve(`pp_${value.provider_id}`)

    const cart = await cartService.retrieve(value.cart_id)

    const { data } = await paymentProvider.updatePayment(
      value.payment_data.paymentData,
      value.payment_data.details
    )

    await cartService.updatePaymentSession(cart._id, value.provider_id, data)

    res.status(200).json({ data })
  } catch (err) {
    throw err
  }
}

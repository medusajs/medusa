import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, provider_id } = req.params

  const schema = Validator.object().keys({
    payment_method: Validator.object().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const paymentProvider = req.scope.resolve("paymentProviderService")

    const cart = await cartService.retrieve(id)

    const authorizedPayment = await paymentProvider.authorizePayment(
      cart,
      provider_id,
      value.payment_method,
      req
    )

    value.payment_method.data = authorizedPayment

    await cartService.setPaymentMethod(cart._id, value.payment_method)

    res.status(200).json({ data: authorizedPayment })
  } catch (err) {
    console.log(err)
    throw err
  }
}

import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
    payment_method: Validator.object().required(),
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const paymentProvider = req.scope.resolve(`pp_${value.provider_id}`)

    const cart = await cartService.retrieve(value.cart_id)

    const { data } = await paymentProvider.authorizePayment(
      cart,
      value.payment_method
    )

    const transactionReference = data.pspReference

    let newPaymentSession = cart.payment_sessions.find(
      (ps) => ps.provider_id === value.provider_id
    )

    newPaymentSession = {
      ...newPaymentSession,
      data,
    }

    await cartService.setMetadata(
      cart._id,
      "adyen_transaction_ref",
      transactionReference
    )

    await cartService.updatePaymentSession(
      cart._id,
      value.provider_id,
      newPaymentSession
    )

    res.status(200).json({ data })
  } catch (err) {
    throw err
  }
}

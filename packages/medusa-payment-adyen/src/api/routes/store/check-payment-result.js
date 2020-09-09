import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    payload: Validator.string().default(""),
    payment_data: Validator.string().required(),
    provider_id: Validator.string().required(),
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyen = req.scope.resolve("adyenService")
    const cartService = req.scope.resolve("cartService")

    const paymentProvider = req.scope.resolve(`pp_${value.provider_id}`)

    const { data } = await adyen.checkPaymentResult(
      value.payment_data,
      value.payload
    )

    const paymentSession = await cartService.retrievePaymentSession(
      value.cart_id,
      value.provider_id
    )

    paymentSession.data = {
      ...paymentSession.data,
      pspReference: data.pspReference,
      resultCode: data.resultCode,
    }

    await cartService.updatePaymentSession(
      value.cart_id,
      value.provider_id,
      paymentSession
    )

    const status = await paymentProvider.getStatus(data)

    res.status(200).json({ status })
  } catch (err) {
    throw err
  }
}

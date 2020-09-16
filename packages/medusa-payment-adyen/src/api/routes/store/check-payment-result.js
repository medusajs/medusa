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

    const result = await adyen.checkPaymentResult(
      value.payment_data,
      value.payload
    )

    const cart = await cartService.retrieve(value.cart_id)

    cart.payment_method.data = {
      ...cart.payment_method.data,
      pspReference: result.pspReference,
      resultCode: result.resultCode,
    }

    await cartService.setPaymentMethod(value.cart_id, cart.payment_method)

    const status = await paymentProvider.getStatus(result)

    res.status(200).json({ status })
  } catch (err) {
    throw err
  }
}

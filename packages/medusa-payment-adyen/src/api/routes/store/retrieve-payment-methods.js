import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyenService = req.scope.resolve("adyenService")
    const cartService = req.scope.resolve("cartService")
    const regionService = req.scope.resolve("regionService")
    const totalsService = req.scope.resolve("totalsService")

    const cart = await cartService.retrieve(value.cart_id)
    const region = await regionService.retrieve(cart.region_id)
    const total = await totalsService.getTotal(cart)

    const allowedMethods = cart.payment_sessions.map(
      (ps) => ps.provider_id.split("Adyen")[0]
    )

    const { data } = await adyenService.retrievePaymentMethods(
      cart,
      allowedMethods,
      total,
      region.currency_code
    )

    res.status(200).json({ paymentMethods: data })
  } catch (err) {
    throw err
  }
}

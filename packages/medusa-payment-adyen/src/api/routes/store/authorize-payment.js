import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const paymentProvider = req.scope.resolve(`pp_${value.provider_id}`)
    const regionService = req.scope.resolve("regionService")
    const totalsService = req.scope.resolve("totalsService")

    const cart = await cartService.retrieve(value.cart_id)

    const paymentSession = await cartService.retrievePaymentSession(
      cart._id,
      value.provider_id
    )

    const region = await regionService.retrieve(cart.region_id)
    const total = await totalsService.getTotal(cart)

    const amount = {
      currency: region.currency_code,
      value: total * 100,
    }

    const { data } = await paymentProvider.authorizePayment(
      cart,
      paymentSession.data.paymentMethod,
      amount
    )

    data.amount = amount
    paymentSession.data = data

    await cartService.updatePaymentSession(
      cart._id,
      value.provider_id,
      paymentSession
    )

    await cartService.setPaymentMethod(cart._id, {
      provider_id: value.provider_id,
      data: paymentSession,
    })

    res.status(200).json({ data })
  } catch (err) {
    throw err
  }
}

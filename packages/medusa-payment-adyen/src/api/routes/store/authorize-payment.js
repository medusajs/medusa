import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
    payment_method: Validator.object()
      .keys({
        provider_id: Validator.string().required(),
        data: Validator.object(),
      })
      .required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const paymentProvider = req.scope.resolve(
      `pp_${value.payment_method.provider_id}`
    )
    const regionService = req.scope.resolve("regionService")
    const totalsService = req.scope.resolve("totalsService")

    const cart = await cartService.retrieve(value.cart_id)

    const region = await regionService.retrieve(cart.region_id)
    const total = await totalsService.getTotal(cart)

    const amount = {
      currency: region.currency_code,
      value: total * 100,
    }

    // Shopper IP address for risk valuation
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress

    const authorizedPayment = await paymentProvider.authorizePayment(
      cart,
      value.payment_method,
      amount,
      ip
    )

    // MongoDB does not allow us to store keys with dots
    if (authorizedPayment.additionalData) {
      delete data.additionalData["recurring.shopperReference"]
      delete data.additionalData["recurring.recurringDetailReference"]
    }

    authorizedPayment.amount = amount
    value.payment_method.data = authorizedPayment

    await cartService.setPaymentMethod(cart._id, value.payment_method)

    res.status(200).json({ data: authorizedPayment })
  } catch (err) {
    console.log(err)
    throw err
  }
}

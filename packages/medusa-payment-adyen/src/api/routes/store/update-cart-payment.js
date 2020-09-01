import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { cart_id } = req.params

  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
    data: Validator.object().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    const session = await cartService.retrievePaymentSession(
      cart_id,
      value.provider_id
    )

    session.data = value.data

    await cartService.updatePaymentSession(cart_id, value.provider_id, session)

    await cartService.setPaymentMethod(cart_id, value)

    let cart = await cartService.retrieve(cart_id)

    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

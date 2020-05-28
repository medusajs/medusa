import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    const session = await cartService.retrievePaymentSession(
      id,
      value.provider_id
    )
    await cartService.setPaymentMethod(id, session)

    let cart = await cartService.retrieve(id)
    cart = await cartService.decorate(cart)

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

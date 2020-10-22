import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, provider_id } = req.params

  const schema = Validator.object().keys({
    provider_id: Validator.string().required(),
    data: Validator.object().default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    const session = await cartService.retrievePaymentSession(id, provider_id)

    session.data = value.data

    let cart = await cartService.updatePaymentSession(id, provider_id, session)

    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

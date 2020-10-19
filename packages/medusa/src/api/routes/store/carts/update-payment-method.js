import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, provider_id } = req.params

  const schema = Validator.object().keys({
    data: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.setPaymentMethod(id, {
      provider_id,
      data: value.data,
    })
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

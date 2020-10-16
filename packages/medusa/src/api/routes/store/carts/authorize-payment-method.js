import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, provider_id } = req.params

  const schema = Validator.object().keys({
    payment_method: Validator.object().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    const authorizedCart = await cartService.authorizePaymentMethod(
      id,
      provider_id,
      value.payment_method,
      req
    )

    res.status(200).json({ cart: authorizedCart })
  } catch (err) {
    console.log(err)
    throw err
  }
}

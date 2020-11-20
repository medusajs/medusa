import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const swapService = req.scope.resolve("swapService")

  try {
    const swap = await swapService.retrieveByCartId(value.cart_id)
    const data = await swapService.registerCartCompletion(
      swap._id,
      value.cart_id
    )

    res.status(200).json({ swap: data })
  } catch (err) {
    throw err
  }
}

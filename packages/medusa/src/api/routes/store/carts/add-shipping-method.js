import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    option_id: Validator.string().required(),
    data: Validator.object()
      .optional()
      .default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.addShippingMethod(id, value.option_id, value.data)

    let cart = await cartService.retrieve(id)
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

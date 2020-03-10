import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    option_id: Validator.string().required(),
    data: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    const method = await cartService.retrieveShippingOption(id, value.option_id)

    // If the option accepts additional data this will be added
    if (!_.isEmpty(value.data)) {
      method.data = {
        ...method.data,
        ...value.data,
      }
    }

    await cartService.addShippingMethod(id, method)

    let cart = await cartService.retrieve(id)
    cart = await cartService.decorate(cart)

    res.status(200).json(cart)
  } catch (err) {
    throw err
  }
}

import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, line_id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.removeLineItem(id, line_id)
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

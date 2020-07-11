import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, code } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.removeDiscount(id, code)
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

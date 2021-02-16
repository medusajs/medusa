import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const draftOrder = await cartService.retrieve(value.cart_id, {
      select: ["subtotal"],
      relations: ["region", "items", "items.variant", "items.variant.product"],
    })

    const options = await shippingProfileService.fetchCartOptions(cart)

    res.status(200).json({ shipping_options: options })
  } catch (err) {
    throw err
  }
}

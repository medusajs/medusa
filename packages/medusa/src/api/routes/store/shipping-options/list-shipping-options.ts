import CartService from "../../../../services/cart"
import ShippingProfileService from "../../../../services/shipping-profile"

/**
 * @oas [get] /shipping-options/{cart_id}
 * operationId: GetShippingOptionsCartId
 * summary: Retrieve Shipping Options for Cart
 * description: "Retrieves a list of Shipping Options available to a cart."
 * parameters:
 *   - (path) cart_id {string} The id of the Cart.
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_options:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const { cart_id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const cart = await cartService.retrieve(cart_id, {
    select: ["subtotal"],
    relations: ["region", "items", "items.variant", "items.variant.product"],
  })

  const options = await shippingProfileService.fetchCartOptions(cart)

  res.status(200).json({ shipping_options: options })
}

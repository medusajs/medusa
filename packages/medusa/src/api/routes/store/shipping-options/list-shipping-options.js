import { Validator, MedusaError } from "medusa-core-utils"
import { CartType } from "../../../../models/cart"

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
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.params)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const cart = await cartService.retrieve(value.cart_id, {
      select: ["subtotal"],
      relations: ["region", "items", "items.variant", "items.variant.product"],
    })

    let options
    if (cart.type === CartType.SWAP || cart.type === CartType.CLAIM) {
      options = await shippingProfileService.fetchRMAOptions(cart)
    } else {
      options = await shippingProfileService.fetchCartOptions(cart)
    }

    res.status(200).json({ shipping_options: options })
  } catch (err) {
    throw err
  }
}

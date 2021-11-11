import { CartService } from "../../../../services"

/**
 * @oas [post] /carts/{id}/payment-sessions/{provider_id}
 * operationId: PostCartsCartPaymentSessionsSession
 * summary: Refresh a Payment Session
 * description: "Refreshes a Payment Session to ensure that it is in sync with the Cart - this is usually not necessary."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) provider_id=* {string} The id of the Payment Provider that created the Payment Session to be refreshed.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id, provider_id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")

  await cartService.refreshPaymentSession(id, provider_id)
  const cart = await cartService.retrieve(id, {
    select: [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "total",
    ],
    relations: [
      "region",
      "region.countries",
      "region.payment_providers",
      "shipping_methods",
      "payment_sessions",
      "shipping_methods.shipping_option",
    ],
  })

  res.status(200).json({ cart })
}

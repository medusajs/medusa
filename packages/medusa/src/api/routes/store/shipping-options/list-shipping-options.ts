import { CartService, PricingService } from "../../../../services"

import ShippingProfileService from "../../../../services/shipping-profile"

/**
 * @oas [get] /shipping-options/{cart_id}
 * operationId: GetShippingOptionsCartId
 * summary: Retrieve Shipping Options for Cart
 * description: "Retrieves a list of Shipping Options available to a cart."
 * parameters:
 *   - (path) cart_id {string} The id of the Cart.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.shippingOptions.listCartOptions(cart_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/shipping-options/{cart_id}'
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
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const cart = await cartService.retrieve(cart_id, {
    select: ["subtotal"],
    relations: [
      "region",
      "items",
      "items.adjustments",
      "items.variant",
      "items.variant.product",
    ],
  })

  const options = await shippingProfileService.fetchCartOptions(cart)

  const data = await pricingService.setShippingOptionPrices(options, {
    cart_id,
  })

  res.status(200).json({ shipping_options: data })
}

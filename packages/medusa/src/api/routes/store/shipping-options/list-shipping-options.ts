import { CartService, PricingService } from "../../../../services"
import ShippingProfileService from "../../../../services/shipping-profile"

/**
 * @oas [get] /store/shipping-options/{cart_id}
 * operationId: GetShippingOptionsCartId
 * summary: List for Cart
 * description: "Retrieve a list of Shipping Options available for a cart."
 * externalDocs:
 *   description: "How to implement shipping step in checkout"
 *   url: "https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow#shipping-step"
 * parameters:
 *   - (path) cart_id {string} The ID of the Cart.
 * x-codegen:
 *   method: listCartOptions
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.shippingOptions.listCartOptions(cartId)
 *       .then(({ shipping_options }) => {
 *         console.log(shipping_options.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/shipping-options/{cart_id}'
 * tags:
 *   - Shipping Options
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartShippingOptionsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { cart_id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const cart = await cartService.retrieveWithTotals(cart_id)
  const options = await shippingProfileService.fetchCartOptions(cart)
  const data = await pricingService.setShippingOptionPrices(options, {
    cart_id,
  })

  res.status(200).json({ shipping_options: data })
}

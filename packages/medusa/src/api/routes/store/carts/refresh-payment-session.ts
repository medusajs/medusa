import { CartService } from "../../../../services"
import { EntityManager } from "typeorm";
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"

/**
 * @oas [post] /carts/{id}/payment-sessions/{provider_id}/refresh
 * operationId: PostCartsCartPaymentSessionsSession
 * summary: Refresh a Payment Session
 * description: "Refreshes a Payment Session to ensure that it is in sync with the Cart - this is usually not necessary."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) provider_id=* {string} The id of the Payment Provider that created the Payment Session to be refreshed.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.refreshPaymentSession(cart_id, 'manual')
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts/{id}/payment-sessions/manual/refresh'
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

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService.withTransaction(transactionManager).refreshPaymentSession(id, provider_id)
  })
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

  const data = await decorateLineItemsWithTotals(cart, req)
  res.status(200).json({ cart: data })
}

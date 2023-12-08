import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [delete] /store/carts/{id}/payment-sessions/{provider_id}
 * operationId: DeleteCartsCartPaymentSessionsSession
 * summary: "Delete a Payment Session"
 * description: "Delete a Payment Session in a Cart. May be useful if a payment has failed. The totals will be recalculated."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 *   - (path) provider_id=* {string} The ID of the Payment Provider used to create the Payment Session to be deleted.
 * x-codegen:
 *   method: deletePaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.deletePaymentSession(cartId, "manual")
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/store/carts/{id}/payment-sessions/{provider_id}'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
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
  const { id, provider_id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService
      .withTransaction(transactionManager)
      .deletePaymentSession(id, provider_id)
  })

  const data = await cartService.retrieveWithTotals(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  await productVariantInventoryService.setVariantAvailability(
    data.items.map((i) => i.variant),
    data.sales_channel_id!
  )

  res.status(200).json({ cart: cleanResponseData(data, []) })
}

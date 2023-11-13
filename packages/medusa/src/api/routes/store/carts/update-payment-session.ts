import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import { IsObject } from "class-validator"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /store/carts/{id}/payment-sessions/{provider_id}
 * operationId: PostCartsCartPaymentSessionUpdate
 * summary: Update a Payment Session
 * description: "Update a Payment Session with additional data. This can be useful depending on the payment provider used.
 *  All payment sessions are updated and cart totals are recalculated afterwards."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 *   - (path) provider_id=* {string} The ID of the payment provider.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartPaymentSessionUpdateReq"
 * x-codegen:
 *   method: updatePaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.updatePaymentSession(cartId, "manual", {
 *         data: {
 *
 *         }
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/payment-sessions/manual' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "data": {}
 *       }'
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

  const validated = req.validatedBody

  const cartService: CartService = req.scope.resolve("cartService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await cartService
      .withTransaction(transactionManager)
      .setPaymentSession(id, provider_id)
    await cartService
      .withTransaction(transactionManager)
      .updatePaymentSession(id, validated.data)
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

/**
 * @schema StorePostCartsCartPaymentSessionUpdateReq
 * type: object
 * required:
 *   - data
 * properties:
 *   data:
 *     type: object
 *     description: The data to update the payment session with.
 */
export class StorePostCartsCartPaymentSessionUpdateReq {
  @IsObject()
  data: Record<string, unknown>
}

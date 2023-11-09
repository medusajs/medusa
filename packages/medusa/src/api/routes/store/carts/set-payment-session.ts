import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import { IsString } from "class-validator"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /store/carts/{id}/payment-session
 * operationId: PostCartsCartPaymentSession
 * summary: Select a Payment Session
 * description: "Select the Payment Session that will be used to complete the cart. This is typically used when the customer chooses their preferred payment method during checkout.
 *  The totals of the cart will be recalculated."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartPaymentSessionReq"
 * x-codegen:
 *   method: setPaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.setPaymentSession(cartId, {
 *         provider_id: "manual"
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/payment-sessions' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "provider_id": "manual"
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
  const { id } = req.params

  const validated = req.validatedBody

  const cartService: CartService = req.scope.resolve("cartService")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService
      .withTransaction(transactionManager)
      .setPaymentSession(id, validated.provider_id)
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
 * @schema StorePostCartsCartPaymentSessionReq
 * type: object
 * required:
 *   - provider_id
 * properties:
 *   provider_id:
 *     type: string
 *     description: The ID of the Payment Provider.
 */
export class StorePostCartsCartPaymentSessionReq {
  @IsString()
  provider_id: string
}

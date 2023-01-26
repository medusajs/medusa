import { IsObject } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /carts/{id}/payment-sessions/{provider_id}
 * operationId: PostCartsCartPaymentSessionUpdate
 * summary: Update a Payment Session
 * description: "Updates a Payment Session with additional data."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) provider_id=* {string} The id of the payment provider.
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
 *       medusa.carts.updatePaymentSession(cart_id, 'manual', {
 *         data: {
 *
 *         }
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts/{id}/payment-sessions/manual' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "data": {}
 *       }'
 * tags:
 *   - Cart
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

  const validated = await validator(
    StorePostCartsCartPaymentSessionUpdateReq,
    req.body
  )

  const cartService: CartService = req.scope.resolve("cartService")

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

  res.status(200).json({ cart: data })
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

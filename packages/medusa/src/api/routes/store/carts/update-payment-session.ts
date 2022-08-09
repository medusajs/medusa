import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { CartService } from "../../../../services"
import { EntityManager } from "typeorm";
import { IsObject } from "class-validator"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/payment-sessions/{provider_id}
 * operationId: PostCartsCartPaymentSessionUpdate
 * summary: Update a Payment Session
 * description: "Updates a Payment Session with additional data."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) provider_id=* {string} The id of the payment provider.
 *   - (body) data=* {object} The data to update the payment session with.
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
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
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
    await cartService.withTransaction(transactionManager).setPaymentSession(id, provider_id)
    await cartService.withTransaction(transactionManager).updatePaymentSession(id, validated.data)
  })

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })
  const data = await decorateLineItemsWithTotals(cart, req)

  res.status(200).json({ cart: data })
}

export class StorePostCartsCartPaymentSessionUpdateReq {
  @IsObject()
  data: Record<string, unknown>
}

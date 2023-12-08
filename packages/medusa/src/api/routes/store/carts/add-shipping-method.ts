import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"
import { IsOptional, IsString } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /store/carts/{id}/shipping-methods
 * operationId: "PostCartsCartShippingMethod"
 * summary: "Add Shipping Method"
 * description: "Add a Shipping Method to the Cart. The validation of the `data` field is handled by the fulfillment provider of the chosen shipping option."
 * parameters:
 *   - (path) id=* {string} The cart ID.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartShippingMethodReq"
 * x-codegen:
 *   method: addShippingMethod
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.addShippingMethod(cartId, {
 *         option_id
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "option_id": "{option_id}",
 *       }'
 * tags:
 *   - Carts
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreCartsRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = req.validatedBody

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve("cartService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  await manager.transaction(async (m) => {
    const txCartService = cartService.withTransaction(m)

    await txCartService.addShippingMethod(
      id,
      validated.option_id,
      validated.data
    )

    const updated = await txCartService.retrieve(id, {
      select: ["id"],
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await txCartService.setPaymentSessions(id)
    }
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
 * @schema StorePostCartsCartShippingMethodReq
 * type: object
 * required:
 *   - option_id
 * properties:
 *   option_id:
 *     type: string
 *     description: ID of the shipping option to create the method from.
 *   data:
 *     type: object
 *     description: Used to hold any data that the shipping method may need to process the fulfillment of the order. This depends on the fulfillment provider you're using.
 */
export class StorePostCartsCartShippingMethodReq {
  @IsString()
  option_id: string

  @IsOptional()
  data?: Record<string, any> = {}
}

import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"
import { IsInt, IsOptional } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /store/carts/{id}/line-items/{line_id}
 * operationId: PostCartsCartLineItemsItem
 * summary: Update a Line Item
 * description: "Update a line item's quantity."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 *   - (path) line_id=* {string} The ID of the Line Item.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartLineItemsItemReq"
 * x-codegen:
 *   method: updateLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.lineItems.update(cartId, lineId, {
 *         quantity: 1
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/line-items/{line_id}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "quantity": 1
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
  const { id, line_id } = req.params

  const validated = req.validatedBody

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve("cartService")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  await manager.transaction(async (m) => {
    // If the quantity is 0 that is effectively deletion
    if (validated.quantity === 0) {
      await cartService.withTransaction(m).removeLineItem(id, line_id)
    } else {
      const cart = await cartService.withTransaction(m).retrieve(id, {
        relations: ["items", "items.variant", "shipping_methods"],
      })

      const existing = cart.items.find((i) => i.id === line_id)
      if (!existing) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Could not find the line item"
        )
      }

      const lineItemUpdate = {
        variant_id: existing.variant.id,
        region_id: cart.region_id,
        quantity: validated.quantity,
        metadata: validated.metadata || {},
        should_calculate_prices: true,
      }

      await cartService
        .withTransaction(m)
        .updateLineItem(id, line_id, lineItemUpdate)
    }

    // If the cart has payment sessions update these
    const updated = await cartService.withTransaction(m).retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await cartService.withTransaction(m).setPaymentSessions(id)
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
 * @schema StorePostCartsCartLineItemsItemReq
 * type: object
 * required:
 *   - quantity
 * properties:
 *   quantity:
 *     type: number
 *     description: The quantity of the line item in the cart.
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details about the Line Item. If omitted, the metadata will remain unchanged."
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class StorePostCartsCartLineItemsItemReq {
  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}

import { CartService, DraftOrderService } from "../../../../services"
import { IsInt, IsObject, IsOptional, IsString } from "class-validator"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
} from "."

import { DraftOrder } from "../../../.."
import { EntityManager } from "typeorm"
import { LineItemUpdate } from "../../../../types/cart"
import { MedusaError } from "medusa-core-utils"
import { validator } from "../../../../utils/validator"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/draft-orders/{id}/line-items/{line_id}
 * operationId: "PostDraftOrdersDraftOrderLineItemsItem"
 * summary: "Update a Line Item"
 * description: "Update a Line Item in a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 *   - (path) line_id=* {string} The ID of the Line Item.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDraftOrdersDraftOrderLineItemsItemReq"
 * x-codegen:
 *   method: updateLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.updateLineItem(draftOrderId, lineId, {
 *         quantity: 1
 *       })
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/draft-orders/{id}/line-items/{line_id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "quantity": 1
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Draft Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDraftOrdersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
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

  const validated = await validator(
    AdminPostDraftOrdersDraftOrderLineItemsItemReq,
    req.body
  )

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const draftOrder: DraftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id, {
        select: defaultAdminDraftOrdersFields,
        relations: ["cart", "cart.items"],
      })

    if (draftOrder.status === "completed") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are only allowed to update open draft orders"
      )
    }

    if (validated.quantity === 0) {
      await cartService
        .withTransaction(manager)
        .removeLineItem(draftOrder.cart.id, line_id)
    } else {
      const existing = draftOrder.cart.items.find((i) => i.id === line_id)

      if (!existing) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Could not find the line item"
        )
      }

      const lineItemUpdate: LineItemUpdate = {
        ...validated,
        region_id: draftOrder.cart.region_id,
      }

      if (existing.variant_id) {
        lineItemUpdate.variant_id = existing.variant_id
      }

      await cartService
        .withTransaction(manager)
        .updateLineItem(draftOrder.cart_id, line_id, lineItemUpdate)
    }

    draftOrder.cart = await cartService
      .withTransaction(manager)
      .retrieveWithTotals(draftOrder.cart_id, {
        relations: defaultAdminDraftOrdersCartRelations,
        select: defaultAdminDraftOrdersCartFields,
      })

    res.status(200).json({
      draft_order: cleanResponseData(draftOrder, []),
    })
  })
}

/**
 * @schema AdminPostDraftOrdersDraftOrderLineItemsItemReq
 * type: object
 * properties:
 *   unit_price:
 *     description: The custom price of the line item. If a `variant_id` is supplied, the price provided here will override the variant's price.
 *     type: integer
 *   title:
 *     description: The title of the line item if `variant_id` is not provided.
 *     type: string
 *   quantity:
 *     description: The quantity of the line item.
 *     type: integer
 *   metadata:
 *     description: The optional key-value map with additional details about the Line Item.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class AdminPostDraftOrdersDraftOrderLineItemsItemReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsInt()
  @IsOptional()
  unit_price?: number

  @IsInt()
  @IsOptional()
  quantity?: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}

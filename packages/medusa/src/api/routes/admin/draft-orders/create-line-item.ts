import {
  CartService,
  DraftOrderService,
  LineItemService,
} from "../../../../services"
import { IsInt, IsObject, IsOptional, IsString } from "class-validator"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
} from "."

import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { validator } from "../../../../utils/validator"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /draft-orders/{id}/line-items
 * operationId: "PostDraftOrdersDraftOrderLineItems"
 * summary: "Create a Line Item"
 * description: "Creates a Line Item for the Draft Order"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostDraftOrdersDraftOrderLineItemsReq"
 * x-codegen:
 *   method: addLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.addLineItem(draft_order_id, {
 *         quantity: 1
 *       })
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}/line-items' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "quantity": 1
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Draft Order
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
  const { id } = req.params

  const validated = await validator(
    AdminPostDraftOrdersDraftOrderLineItemsReq,
    req.body
  )

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")
  const lineItemService: LineItemService = req.scope.resolve("lineItemService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    const draftOrder = await draftOrderService
      .withTransaction(manager)
      .retrieve(id, {
        select: defaultAdminDraftOrdersFields,
        relations: ["cart"],
      })

    if (draftOrder.status === "completed") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You are only allowed to update open draft orders"
      )
    }

    if (validated.variant_id) {
      const line = await lineItemService
        .withTransaction(manager)
        .generate(
          validated.variant_id,
          draftOrder.cart.region_id,
          validated.quantity,
          { metadata: validated.metadata, unit_price: validated.unit_price }
        )

      await cartService
        .withTransaction(manager)
        .addLineItem(draftOrder.cart_id, line, { validateSalesChannels: false })
    } else {
      // custom line items can be added to a draft order
      await lineItemService.withTransaction(manager).create({
        cart_id: draftOrder.cart_id,
        has_shipping: true,
        title: validated.title,
        allow_discounts: false,
        unit_price: validated.unit_price || 0,
        quantity: validated.quantity,
      })
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
 * @schema AdminPostDraftOrdersDraftOrderLineItemsReq
 * type: object
 * required:
 *   - quantity
 * properties:
 *   variant_id:
 *     description: The ID of the Product Variant to generate the Line Item from.
 *     type: string
 *   unit_price:
 *     description: The potential custom price of the item.
 *     type: integer
 *   title:
 *     description: The potential custom title of the item.
 *     type: string
 *     default: "Custom item"
 *   quantity:
 *     description: The quantity of the Line Item.
 *     type: integer
 *   metadata:
 *     description: The optional key-value map with additional details about the Line Item.
 *     type: object
 */
export class AdminPostDraftOrdersDraftOrderLineItemsReq {
  @IsString()
  @IsOptional()
  title?: string = "Custom item"

  @IsInt()
  @IsOptional()
  unit_price?: number

  @IsString()
  @IsOptional()
  variant_id?: string

  @IsInt()
  quantity: number

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> = {}
}

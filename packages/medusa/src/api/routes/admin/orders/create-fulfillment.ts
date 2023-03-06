import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { EntityManager } from "typeorm"
import {
  OrderService,
  ProductVariantInventoryService,
} from "../../../../services"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"
import { Fulfillment, LineItem } from "../../../../models"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /orders/{id}/fulfillment
 * operationId: "PostOrdersOrderFulfillments"
 * summary: "Create a Fulfillment"
 * description: "Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma separated list of relations to include in the result.
 *   - (query) fields {string} Comma separated list of fields to include in the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderFulfillmentsReq"
 * x-codegen:
 *   method: createFulfillment
 *   params: AdminPostOrdersOrderFulfillmentsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createFulfillment(order_id, {
 *         items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/fulfillment' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "items": [
 *             {
 *               "item_id": "{item_id}",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Fulfillment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
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

  const validated = req.validatedBody

  const orderService: OrderService = req.scope.resolve("orderService")
  const pvInventoryService: ProductVariantInventoryService = req.scope.resolve(
    "productVariantInventoryService"
  )
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    const { fulfillments: existingFulfillments } = await orderService
      .withTransaction(transactionManager)
      .retrieve(id, {
        relations: ["fulfillments"],
      })
    const existingFulfillmentMap = new Map(
      existingFulfillments.map((fulfillment) => [fulfillment.id, fulfillment])
    )

    const { fulfillments } = await orderService
      .withTransaction(transactionManager)
      .createFulfillment(id, validated.items, {
        metadata: validated.metadata,
        no_notification: validated.no_notification,
      })

    const pvInventoryServiceTx =
      pvInventoryService.withTransaction(transactionManager)

    if (validated.location_id) {
      await updateInventoryAndReservations(
        fulfillments.filter((f) => !existingFulfillmentMap[f.id]),
        {
          inventoryService: pvInventoryServiceTx,
          locationId: validated.location_id,
        }
      )
    }
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.json({ order })
}

const updateInventoryAndReservations = async (
  fulfillments: Fulfillment[],
  context: {
    inventoryService: ProductVariantInventoryService
    locationId: string
  }
) => {
  const { inventoryService, locationId } = context

  fulfillments.map(async ({ items }) => {
    await inventoryService.validateInventoryAtLocation(
      items.map(({ item, quantity }) => ({ ...item, quantity } as LineItem)),
      locationId
    )

    await Promise.all(
      items.map(async ({ item, quantity }) => {
        if (!item.variant_id) {
          return
        }

        await inventoryService.adjustReservationsQuantityByLineItem(
          item.id,
          item.variant_id,
          locationId,
          -quantity
        )

        await inventoryService.adjustInventory(
          item.variant_id,
          locationId,
          -quantity
        )
      })
    )
  })
}

/**
 * @schema AdminPostOrdersOrderFulfillmentsReq
 * type: object
 * required:
 *   - items
 * properties:
 *   items:
 *     description: The Line Items to include in the Fulfillment.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - item_id
 *         - quantity
 *       properties:
 *         item_id:
 *           description: The ID of Line Item to fulfill.
 *           type: string
 *         quantity:
 *           description: The quantity of the Line Item to fulfill.
 *           type: integer
 *   no_notification:
 *     description: If set to true no notification will be send related to this Swap.
 *     type: boolean
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
export class AdminPostOrdersOrderFulfillmentsReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[]

  @IsString()
  @IsOptional()
  location_id?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  no_notification?: boolean

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

class Item {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsInt()
  @IsNotEmpty()
  quantity: number
}

export class AdminPostOrdersOrderFulfillmentsParams extends FindParams {}

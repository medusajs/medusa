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
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { promiseAll } from "@medusajs/utils"

/**
 * @oas [post] /admin/orders/{id}/fulfillment
 * operationId: "PostOrdersOrderFulfillments"
 * summary: "Create a Fulfillment"
 * description: "Create a Fulfillment of an Order using the fulfillment provider, and change the order's fulfillment status to either `partially_fulfilled` or `fulfilled`, depending on
 *  whether all the items were fulfilled."
 * x-authenticated: true
 * externalDocs:
 *   description: Fulfillments of orders
 *   url: https://docs.medusajs.com/modules/orders/#fulfillments-in-orders
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
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
 *       medusa.admin.orders.createFulfillment(orderId, {
 *         items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/fulfillment' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
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
 *   - jwt_token: []
 * tags:
 *   - Orders
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

  const { validatedBody } = req as {
    validatedBody: AdminPostOrdersOrderFulfillmentsReq
  }

  const orderService: OrderService = req.scope.resolve("orderService")
  const pvInventoryService: ProductVariantInventoryService = req.scope.resolve(
    "productVariantInventoryService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    const orderServiceTx = orderService.withTransaction(transactionManager)

    const { fulfillments: existingFulfillments } =
      await orderServiceTx.retrieve(id, {
        relations: ["fulfillments"],
      })
    const existingFulfillmentSet = new Set(
      existingFulfillments.map((fulfillment) => fulfillment.id)
    )

    await orderServiceTx.createFulfillment(id, validatedBody.items, {
      metadata: validatedBody.metadata,
      no_notification: validatedBody.no_notification,
      location_id: validatedBody.location_id,
    })

    if (validatedBody.location_id) {
      const { fulfillments } = await orderServiceTx.retrieve(id, {
        relations: [
          "fulfillments",
          "fulfillments.items",
          "fulfillments.items.item",
        ],
      })

      const pvInventoryServiceTx =
        pvInventoryService.withTransaction(transactionManager)

      await updateInventoryAndReservations(
        fulfillments.filter((f) => !existingFulfillmentSet.has(f.id)),
        {
          inventoryService: pvInventoryServiceTx,
          locationId: validatedBody.location_id,
        }
      )
    }
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.json({ order: cleanResponseData(order, []) })
}

export const updateInventoryAndReservations = async (
  fulfillments: Fulfillment[],
  context: {
    inventoryService: ProductVariantInventoryService
    locationId: string
  }
) => {
  const { inventoryService, locationId } = context

  await promiseAll(
    fulfillments.map(async ({ items }) => {
      await inventoryService.validateInventoryAtLocation(
        items.map(({ item, quantity }) => ({ ...item, quantity } as LineItem)),
        locationId
      )
    })
  )

  await promiseAll(
    fulfillments.map(async ({ items }) => {
      await promiseAll(
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
  )
}

/**
 * @schema AdminPostOrdersOrderFulfillmentsReq
 * type: object
 * description: "The details of the fulfillment to be created."
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
 *           description: The ID of the Line Item to fulfill.
 *           type: string
 *         quantity:
 *           description: The quantity of the Line Item to fulfill.
 *           type: integer
 *   location_id:
 *     type: string
 *     description: "The ID of the location where the items will be fulfilled from."
 *   no_notification:
 *     description: >-
 *       If set to `true`, no notification will be sent to the customer related to this fulfillment.
 *     type: boolean
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
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

import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator"
import {
  OrderService,
  ProductVariantInventoryService,
  SwapService,
} from "../../../../services"

import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { validator } from "../../../../utils/validator"
import { updateInventoryAndReservations } from "./create-fulfillment"

/**
 * @oas [post] /admin/orders/{id}/swaps/{swap_id}/fulfillments
 * operationId: "PostOrdersOrderSwapsSwapFulfillments"
 * summary: "Create Swap Fulfillment"
 * description: "Creates a Fulfillment for a Swap."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (path) swap_id=* {string} The ID of the Swap.
 *   - (query) expand {string} Comma separated list of relations to include in the result.
 *   - (query) fields {string} Comma separated list of fields to include in the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderSwapsSwapFulfillmentsReq"
 * x-codegen:
 *   method: fulfillSwap
 *   params: AdminPostOrdersOrderSwapsSwapFulfillmentsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.fulfillSwap(order_id, swap_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps/{swap_id}/fulfillments' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const { id, swap_id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const entityManager: EntityManager = req.scope.resolve("manager")
  const pvInventoryService: ProductVariantInventoryService = req.scope.resolve(
    "productVariantInventoryService"
  )

  await entityManager.transaction(async (manager) => {
    const swapServiceTx = swapService.withTransaction(manager)

    const { fulfillments: existingFulfillments } = await swapServiceTx.retrieve(
      swap_id,
      {
        relations: [
          "fulfillments",
          "fulfillments.items",
          "fulfillments.items.item",
        ],
      }
    )

    const existingFulfillmentSet = new Set(
      existingFulfillments.map((fulfillment) => fulfillment.id)
    )

    await swapServiceTx.createFulfillment(swap_id, {
      metadata: validated.metadata,
      no_notification: validated.no_notification,
      location_id: validated.location_id,
    })

    if (validated.location_id) {
      const { fulfillments } = await swapServiceTx.retrieve(swap_id, {
        relations: [
          "fulfillments",
          "fulfillments.items",
          "fulfillments.items.item",
        ],
      })

      const pvInventoryServiceTx = pvInventoryService.withTransaction(manager)

      await updateInventoryAndReservations(
        fulfillments.filter((f) => !existingFulfillmentSet.has(f.id)),
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

  res.status(200).json({ order: cleanResponseData(order, []) })
}

/**
 * @schema AdminPostOrdersOrderSwapsSwapFulfillmentsReq
 * type: object
 * properties:
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *   no_notification:
 *     description: If set to true no notification will be send related to this Claim.
 *     type: boolean
 */
export class AdminPostOrdersOrderSwapsSwapFulfillmentsReq {
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean

  @IsString()
  @IsOptional()
  location_id?: string
}

// eslint-disable-next-line max-len
export class AdminPostOrdersOrderSwapsSwapFulfillmentsParams extends FindParams {}

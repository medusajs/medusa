import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator"
import {
  ClaimService,
  OrderService,
  ProductVariantInventoryService,
} from "../../../../services"

import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { updateInventoryAndReservations } from "./create-fulfillment"

/**
 * @oas [post] /admin/orders/{id}/claims/{claim_id}/fulfillments
 * operationId: "PostOrdersOrderClaimsClaimFulfillments"
 * summary: "Create Claim Fulfillment"
 * description: "Creates a Fulfillment for a Claim."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (path) claim_id=* {string} The ID of the Claim.
 *   - (query) expand {string} Comma separated list of relations to include in the result.
 *   - (query) fields {string} Comma separated list of fields to include in the result.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderClaimsClaimFulfillmentsReq"
 * x-codegen:
 *   method: fulfillClaim
 *   params: AdminPostOrdersOrderClaimsClaimFulfillmentsReq
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.fulfillClaim(order_id, claim_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/claims/{claim_id}/fulfillments' \
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
  const { id, claim_id } = req.params

  const validated = req.validatedBody

  const orderService: OrderService = req.scope.resolve("orderService")
  const claimService: ClaimService = req.scope.resolve("claimService")
  const entityManager: EntityManager = req.scope.resolve("manager")
  const pvInventoryService: ProductVariantInventoryService = req.scope.resolve(
    "productVariantInventoryService"
  )

  await entityManager.transaction(async (manager) => {
    const claimServiceTx = claimService.withTransaction(manager)

    const { fulfillments: existingFulfillments } =
      await claimServiceTx.retrieve(claim_id, {
        relations: [
          "fulfillments",
          "fulfillments.items",
          "fulfillments.items.item",
        ],
      })

    const existingFulfillmentSet = new Set(
      existingFulfillments.map((fulfillment) => fulfillment.id)
    )

    await claimServiceTx.createFulfillment(claim_id, {
      metadata: validated.metadata,
      no_notification: validated.no_notification,
      location_id: validated.location_id,
    })

    if (validated.location_id) {
      const { fulfillments } = await claimServiceTx.retrieve(claim_id, {
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
 * @schema AdminPostOrdersOrderClaimsClaimFulfillmentsReq
 * type: object
 * properties:
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 *   no_notification:
 *     description: If set to true no notification will be send related to this Claim.
 *     type: boolean
 */
export class AdminPostOrdersOrderClaimsClaimFulfillmentsReq {
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
export class AdminPostOrdersOrderClaimsClaimFulfillmentsParams extends FindParams {}

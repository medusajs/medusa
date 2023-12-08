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
 * summary: "Create a Claim Fulfillment"
 * description: "Create a Fulfillment for a Claim, and change its fulfillment status to `partially_fulfilled` or `fulfilled` depending on whether all the items were fulfilled.
 * It may also change the status to `requires_action` if any actions are required."
 * x-authenticated: true
 * externalDocs:
 *   description: Fulfill a claim
 *   url: https://docs.medusajs.com/modules/orders/claims#fulfill-a-claim
 * parameters:
 *   - (path) id=* {string} The ID of the Order the claim is associated with.
 *   - (path) claim_id=* {string} The ID of the Claim.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
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
 *       medusa.admin.orders.fulfillClaim(orderId, claimId, {
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/claims/{claim_id}/fulfillments' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   no_notification:
 *     description: >-
 *       If set to `true`, no notification will be sent to the customer related to this Claim.
 *     type: boolean
 *   location_id:
 *     description: "The ID of the fulfillment's location."
 *     type: string
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

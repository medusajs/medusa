import { ClaimService, OrderService } from "../../../../services"
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/orders/{id}/claims/{claim_id}/shipments
 * operationId: "PostOrdersOrderClaimsClaimShipments"
 * summary: "Ship a Claim's Fulfillment"
 * description: "Create a shipment for the claim and mark its fulfillment as shipped. This changes the claim's fulfillment status to either `partially_shipped` or `shipped`, depending on
 *  whether all the items were shipped."
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
 *         $ref: "#/components/schemas/AdminPostOrdersOrderClaimsClaimShipmentsReq"
 * x-codegen:
 *   method: createClaimShipment
 *   params: AdminPostOrdersOrderClaimsClaimShipmentsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createClaimShipment(orderId, claimId, {
 *         fulfillment_id
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/claims/{claim_id}/shipments' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "fulfillment_id": "{fulfillment_id}"
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
  const { id, claim_id } = req.params

  const validated = req.validatedBody

  const orderService: OrderService = req.scope.resolve("orderService")
  const claimService: ClaimService = req.scope.resolve("claimService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await claimService
      .withTransaction(transactionManager)
      .createShipment(
        claim_id,
        validated.fulfillment_id,
        validated.tracking_numbers?.map((n) => ({ tracking_number: n }))
      )
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.json({ order: cleanResponseData(order, []) })
}

/**
 * @schema AdminPostOrdersOrderClaimsClaimShipmentsReq
 * type: object
 * required:
 *   - fulfillment_id
 * properties:
 *   fulfillment_id:
 *     description: The ID of the Fulfillment.
 *     type: string
 *   tracking_numbers:
 *     description: An array of tracking numbers for the shipment.
 *     type: array
 *     items:
 *       type: string
 */
export class AdminPostOrdersOrderClaimsClaimShipmentsReq {
  @IsString()
  @IsNotEmpty()
  fulfillment_id: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tracking_numbers?: string[]
}

// eslint-disable-next-line max-len
export class AdminPostOrdersOrderClaimsClaimShipmentsParams extends FindParams {}

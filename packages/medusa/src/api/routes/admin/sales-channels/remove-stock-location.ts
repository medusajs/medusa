import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { IsString } from "class-validator"
import { SalesChannelLocationService } from "../../../../services"

/**
 * @oas [delete] /admin/sales-channels/{id}/stock-locations
 * operationId: "DeleteSalesChannelsSalesChannelStockLocation"
 * summary: "Remove Stock Location from Sales Channels."
 * description: "Remove a stock location from a Sales Channel. This only removes the association between the stock location and the sales channel. It does not delete the stock location."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales Channel.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteSalesChannelsChannelStockLocationsReq"
 * x-codegen:
 *   method: removeLocation
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.removeLocation(salesChannelId, {
 *         location_id: "loc_id"
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/sales-channels/{id}/stock-locations' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "locaton_id": "loc_id"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Sales Channels
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSalesChannelsDeleteLocationRes"
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
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminDeleteSalesChannelsChannelStockLocationsReq
  }

  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await channelLocationService
      .withTransaction(transactionManager)
      .removeLocation(validatedBody.location_id, id)
  })

  res.json({
    id,
    object: "stock-location",
    deleted: true,
  })
}

/**
 * @schema AdminDeleteSalesChannelsChannelStockLocationsReq
 * type: object
 * required:
 *   - location_id
 * properties:
 *   location_id:
 *     description: The ID of the stock location
 *     type: string
 */
export class AdminDeleteSalesChannelsChannelStockLocationsReq {
  @IsString()
  location_id: string
}

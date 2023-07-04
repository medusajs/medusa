import { IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../services"

/**
 * @oas [post] /admin/sales-channels/{id}/stock-locations
 * operationId: "PostSalesChannelsSalesChannelStockLocation"
 * summary: "Associate a Stock Location"
 * description: "Associates a stock location with a Sales Channel."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Sales Channel.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostSalesChannelsChannelStockLocationsReq"
 * x-codegen:
 *   method: addLocation
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.addLocation(salesChannelId, {
 *         location_id: 'loc_123'
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels/{id}/stock-locations' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "locaton_id": "loc_123"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Sales Channels
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSalesChannelsRes"
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
    validatedBody: AdminPostSalesChannelsChannelStockLocationsReq
  }

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await channelLocationService
      .withTransaction(transactionManager)
      .associateLocation(id, validatedBody.location_id)
  })

  const channel = await salesChannelService.retrieve(id)

  res.status(200).json({ sales_channel: channel })
}

/**
 * @schema AdminPostSalesChannelsChannelStockLocationsReq
 * type: object
 * required:
 *   - location_id
 * properties:
 *   location_id:
 *     description: The ID of the stock location
 *     type: string
 */

export class AdminPostSalesChannelsChannelStockLocationsReq {
  @IsString()
  location_id: string
}

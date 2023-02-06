import { IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import { SalesChannelLocationService } from "../../../../services"

/**
 * @oas [delete] /sales-channels/{id}/stock-locations
 * operationId: "DeleteSalesChannelsSalesChannelStockLocation"
 * summary: "Remove a stock location from a Sales Channel"
 * description: "Removes a stock location from a Sales Channel."
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
 *       medusa.admin.salesChannels.removeLocation(sales_channel_id, {
 *         location_id: 'App'
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/sales-channels/{id}/stock-locations' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "locaton_id": "stock_location_id"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Sales Channel
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
      .removeLocation(id, validatedBody.location_id)
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

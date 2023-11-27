import { IStockLocationService } from "@medusajs/types"
import { Request, Response } from "express"
import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../services"
import { FindParams } from "../../../../types/common"
import { joinSalesChannels } from "./utils/join-sales-channels"

/**
 * @oas [get] /admin/stock-locations/{id}
 * operationId: "GetStockLocationsStockLocation"
 * summary: "Get a Stock Location"
 * description: "Retrieve a Stock Location's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Stock Location.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned stock location.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned stock location.
 * x-codegen:
 *   method: retrieve
 *   queryParams: AdminGetStockLocationsLocationParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.stockLocations.retrieve(stockLocationId)
 *       .then(({ stock_location }) => {
 *         console.log(stock_location.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/stock-locations/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Stock Locations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStockLocationsRes"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const locationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )
  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const { retrieveConfig } = req

  const includeSalesChannels =
    !!retrieveConfig.relations?.includes("sales_channels")

  if (includeSalesChannels) {
    retrieveConfig.relations = retrieveConfig.relations?.filter(
      (r) => r !== "sales_channels"
    )
  }

  let stockLocation = await locationService.retrieve(id, retrieveConfig)

  if (includeSalesChannels) {
    const [location] = await joinSalesChannels(
      [stockLocation],
      channelLocationService,
      salesChannelService
    )
    stockLocation = location
  }

  res.status(200).json({ stock_location: stockLocation })
}

export class AdminGetStockLocationsLocationParams extends FindParams {}

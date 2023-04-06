import { IStockLocationService } from "@medusajs/types"
import { IsOptional } from "class-validator"
import { Request, Response } from "express"
import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { joinSalesChannels } from "./utils/join-sales-channels"

/**
 * @oas [get] /admin/stock-locations
 * operationId: "GetStockLocations"
 * summary: "List Stock Locations"
 * description: "Retrieves a list of stock locations"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} ID of the stock location
 *   - (query) name {string} Name of the stock location
 *   - (query) order {string} The field to order the results by.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting collections were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting collections were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Date comparison for when resulting collections were deleted.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} How many stock locations to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of stock locations returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each stock location of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each stock location of the result.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetStockLocationsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.stockLocations.list()
 *       .then(({ stock_locations, limit, offset, count }) => {
 *         console.log(stock_locations.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/stock-locations' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Stock Locations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStockLocationsListRes"
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
  const stockLocationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )
  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const filterOnSalesChannel = !!filterableFields.sales_channel_id

  const includeSalesChannels =
    !!listConfig.relations?.includes("sales_channels")

  if (includeSalesChannels) {
    listConfig.relations = listConfig.relations?.filter(
      (r) => r !== "sales_channels"
    )
  }

  if (filterOnSalesChannel) {
    const ids: string[] = Array.isArray(filterableFields.sales_channel_id)
      ? filterableFields.sales_channel_id
      : [filterableFields.sales_channel_id]

    delete filterableFields.sales_channel_id

    const locationIds = await channelLocationService.listLocationIds(ids)

    filterableFields.id = [...new Set(locationIds.flat())]
  }

  let [locations, count] = await stockLocationService.listAndCount(
    filterableFields,
    listConfig
  )

  if (includeSalesChannels) {
    locations = await joinSalesChannels(
      locations,
      channelLocationService,
      salesChannelService
    )
  }

  res.status(200).json({
    stock_locations: locations,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetStockLocationsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  name?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  address_id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  sales_channel_id?: string | string[]
}

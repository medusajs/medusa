import { IsOptional } from "class-validator"
import { IsType } from "../../../../utils/validators/is-type"

import { IStockLocationService } from "../../../../interfaces"
import { extendedFindParamsMixin } from "../../../../types/common"
import { Request, Response } from "express"

/**
 * @oas [get] /stock-locations
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
 *   - Sales Channel
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

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [locations, count] = await stockLocationService.listAndCount(
    filterableFields,
    listConfig
  )

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
}

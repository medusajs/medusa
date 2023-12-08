import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { SalesChannelService } from "../../../../services"
import { Type } from "class-transformer"

/**
 * @oas [get] /admin/sales-channels
 * operationId: "GetSalesChannels"
 * summary: "List Sales Channels"
 * description: "Retrieve a list of sales channels. The sales channels can be filtered by fields such as `q` or `name`. The sales channels can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} Filter by a sales channel ID.
 *   - (query) name {string} Filter by name.
 *   - (query) description {string} Filter by description.
 *   - (query) q {string} term used to search sales channels' names and descriptions.
 *   - (query) order {string} A sales-channel field to sort-order the retrieved sales channels by.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
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
 *     description: Filter by an update date range.
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
 *     description: Filter by a deletion date range.
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
 *   - (query) offset=0 {integer} The number of sales channels to skip when retrieving the sales channels.
 *   - (query) limit=20 {integer} Limit the number of sales channels returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned sales channels.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned sales channels.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetSalesChannelsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.list()
 *       .then(({ sales_channels, limit, offset, count }) => {
 *         console.log(sales_channels.length)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/sales-channels' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 *           $ref: "#/components/schemas/AdminSalesChannelsListRes"
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
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const listConfig = req.listConfig
  const filterableFields = req.filterableFields

  const [salesChannels, count] = await salesChannelService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    sales_channels: salesChannels,
    count,
    offset: listConfig.skip,
    limit: listConfig.take,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved sales channels.
 */
export class AdminGetSalesChannelsParams extends extendedFindParamsMixin() {
  /**
   * ID to filter sales channels by.
   */
  @IsString()
  @IsOptional()
  id?: string

  /**
   * Search term to search sales channels' names and descriptions.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * Name to filter sales channels by.
   */
  @IsOptional()
  @IsString()
  name?: string

  /**
   * Description to filter sales channels by.
   */
  @IsOptional()
  @IsString()
  description?: string

  /**
   * Date filters to apply on sales channels' `created_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on sales channels' `updated_at` field.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on sales channels' `deleted_at` field.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string
}

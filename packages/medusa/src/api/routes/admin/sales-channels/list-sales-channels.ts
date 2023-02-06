import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { SalesChannelService } from "../../../../services"
import { Type } from "class-transformer"

/**
 * @oas [get] /sales-channels
 * operationId: "GetSalesChannels"
 * summary: "List Sales Channels"
 * description: "Retrieves a list of sales channels"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} ID of the sales channel
 *   - (query) name {string} Name of the sales channel
 *   - (query) description {string} Description of the sales channel
 *   - (query) q {string} Query used for searching sales channels' names and descriptions.
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
 *   - (query) offset=0 {integer} How many sales channels to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of sales channels returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each sales channel of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each sales channel of the result.
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
 *         console.log(sales_channels.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/sales-channels' \
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

export class AdminGetSalesChannelsParams extends extendedFindParamsMixin() {
  @IsString()
  @IsOptional()
  id?: string

  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  order?: string
}

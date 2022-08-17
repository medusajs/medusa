import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { SalesChannelService } from "../../../../services"
import { Type } from "class-transformer"
import { removeUndefinedProperties } from "../../../../utils"

/**
 * @oas [get] /sales-channels
 * operationId: "GetSalesChannels"
 * summary: "List sales channels"
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
 * tags:
 *   - Sales Channel
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             sales_channels:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/sales_channel"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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

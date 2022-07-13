import { Request, Response } from "express"
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { removeUndefinedProperties } from "../../../../utils"
import { SalesChannelService } from "../../../../services"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"

/**
 * @oas [get] /sales-channels
 * operationId: "GetSalesChannels"
 * summary: "List sales channels"
 * description: "Retrieves a list of sales channels"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} id of the sales channel
 *   - (query) name {string} Name of the sales channel
 *   - (query) description {string} Description of the sales channel
 *   - (query) q {string} Query used for searching sales channels.
 *   - (query) order {string} to retrieve sales channels in.
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting sales channels was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting sales channels was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting sales channels was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many sales channels to skip in the result.
 *   - (query) limit {string} Limit the number of sales channels returned.
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
 *             count:
 *               description: The number of Sales channels.
 *               type: integer
 *             offset:
 *               description: The offset of the Sales channel query.
 *               type: integer
 *             limit:
 *               description: The limit of the Sales channel query.
 *               type: integer
 *             sales_channels:
 *               type: array
 *               items:
 *               $ref: "#/components/schemas/sales_channel"
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

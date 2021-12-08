import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."
import { IsInt, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import _, { identity } from "lodash"
import { DateComparisonOperator } from "../../../../types/common"

/**
 * @oas [get] /regions
 * operationId: "GetRegions"
 * summary: "List Regions"
 * description: "Retrieves a list of Regions."
 * x-authenticated: true
 * parameters:
 *  - in: query
 *    name: limit
 *    schema:
 *      type: integer
 *    required: false
 *    description: limit the number of regions in response
 *  - in: query
 *    name: offset
 *    schema:
 *      type: integer
 *    required: false
 *    description: Offset of regions in response (used for pagination)
 * - in: query
 *    name: created_at
 *    schema:
 *      type: DateComparisonOperator
 *    required: false
 *    description: Date comparison for when resulting region was created, i.e. less than, greater than etc.
 * - in: query
 *    name: updated_at
 *    schema:
 *      type: DateComparisonOperator
 *    required: false
 *    description: Date comparison for when resulting region was updated, i.e. less than, greater than etc.
 * - in: query
 *    name: deleted_at
 *    schema:
 *      type: DateComparisonOperator
 *    required: false
 *    description: Date comparison for when resulting region was deleted, i.e. less than, greater than etc.
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             regions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetRegionsParams, req.query)

  const regionService: RegionService = req.scope.resolve("regionService")

  const filterableFields = _.omit(validated, ["limit", "offset"])

  const listConfig = {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const regions: Region[] = await regionService.list(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.json({
    regions,
    count: regions.length,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetRegionsPaginationParams {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}

export class AdminGetRegionsParams extends AdminGetRegionsPaginationParams {
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
}

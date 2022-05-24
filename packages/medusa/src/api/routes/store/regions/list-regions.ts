import { Type } from "class-transformer"
import { omit } from "lodash"
import { ValidateNested, IsInt, IsOptional } from "class-validator"
import RegionService from "../../../../services/region"
import { validator } from "../../../../utils/validator"
import { DateComparisonOperator } from "../../../../types/common"

/**
 * @oas [get] /regions
 * operationId: GetRegions
 * summary: List Regions
 * description: "Retrieves a list of Regions."
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of regions.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of regions to return,
 *               type: integer
 *             regions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const validated = await validator(StoreGetRegionsParams, req.query)
  const { limit, offset } = validated

  const regionService: RegionService = req.scope.resolve("regionService")

  const filterableFields = omit(validated, ["limit", "offset"])

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(filterableFields, listConfig)

  res.json({ regions })
}

export class StoreGetRegionsParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 100

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

import { Type } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"
import RegionService from "../../../../services/region"
import { validator } from "../../../../utils/validator"
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
  const { limit, offset } = await validator(StoreGetRegionsParams, req.query)

  const regionService: RegionService = req.scope.resolve("regionService")

  const selector = {}

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(selector, listConfig)

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
}

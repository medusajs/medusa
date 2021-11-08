import { defaultFields, defaultRelations } from "."
import { validator } from "medusa-core-utils"
import Region from "../../../.."
import RegionService from "../../../../services/region"

/**
 * @oas [get] /regions
 * operationId: "GetRegions"
 * summary: "List Regions"
 * description: "Retrieves a list of Regions."
 * x-authenticated: true
 * parameters:
 *  - in: path
 *    name: limit
 *    schema:
 *      type: integer
 *    required: false
 *    description: limit the number of regions in response
 *  - in: path
 *    name: offset
 *    schema:
 *      type: integer
 *    required: false
 *    description: Offset of regions in response (used for pagination)
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
  const validated = await validator(AdminListRegionsRequest, req.query)

  const regionService = req.scope.resolve("regionService") as RegionService

  const limit: number = validated.limit || 50
  const offset: number = validated.offset || 0

  const selector = {}

  const listConfig = {
    select: defaultFields,
    relations: defaultRelations,
    skip: offset,
    take: limit,
  }

  const regions: Region[] = await regionService.list(selector, listConfig)

  res.json({ regions, count: regions.length, offset, limit })
}

export class AdminListRegionsRequest {
  limit?: number
  offset?: number
}

export class AdminListRegionsResponse {
  regions: Region[]
  count: number
  offset: number
  limit: number
}

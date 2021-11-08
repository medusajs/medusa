import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
import Region from "../../../.."
import RegionService from "../../../../services/region"

/**
 * @oas [get] /regions/{id}
 * operationId: "GetRegionsRegion"
 * summary: "Retrieve a Region"
 * description: "Retrieves a Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             region:
 *               $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetRegionRequest, req.query)

  const { region_id } = validated
  const regionService = req.scope.resolve("regionService") as RegionService
  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ region })
}

export class AdminGetRegionRequest {
  region_id: string
}
export class AdminGetRegionResponse {
  region: Region
}

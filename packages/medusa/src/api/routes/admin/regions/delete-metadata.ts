import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
import Region from "../../../.."
import RegionService from "../../../../services/region"

/**
 * @oas [delete] /regions/{id}/metadata/{key}
 * operationId: "DeleteRegionsRegionMetadataKey"
 * summary: "Delete Metadata"
 * description: "Deletes a metadata key."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) key=* {string} The metadata key.
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
  const validated = await validator(
    AdminRegionDeleteMetadataRequest,
    req.params
  )

  const { id, key } = validated

  const regionService = req.scope.resolve("regionService") as RegionService
  await regionService.deleteMetadata(id, key)

  const region: Region = await regionService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ region })
}

export class AdminRegionDeleteMetadataRequest {
  id: string
  key: string
}

export class AdminRegionDeleteMetadataResponse {
  region: Region
}

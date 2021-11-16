import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."
import { Region } from "../../../.."
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
  const { id, key } = req.params

  const regionService: RegionService = req.scope.resolve("regionService")
  await regionService.deleteMetadata(id, key)

  const region: Region = await regionService.retrieve(id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.status(200).json({ region })
}

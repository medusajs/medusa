import RegionService from "../../../../services/region"
import Region from "../../../.."

/**
 * @oas [delete] /regions/{id}
 * operationId: "DeleteRegionsRegion"
 * summary: "Delete a Region"
 * description: "Deletes a Region."
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
 *             id:
 *               type: string
 *               description: The id of the deleted Region.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { region_id } = req.params
  const regionService: Region = req.scope.resolve(
    "regionService"
  ) as RegionService

  await regionService.delete(region_id)

  res.status(200).json({
    id: region_id,
    object: "region",
    deleted: true,
  })
}

export class DeleteResponse {
  id: string
  object: string
  deleted: boolean
}

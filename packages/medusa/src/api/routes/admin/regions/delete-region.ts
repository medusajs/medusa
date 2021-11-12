import { validator } from "../../../../utils/validator"
import RegionService from "../../../../services/region"
import { IsString } from "class-validator"

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
  const validated = await validator(AdminDeleteRegionParams, req.params)

  const regionService: RegionService = req.scope.resolve("regionService")

  await regionService.delete(validated.region_id)

  res.status(200).json({
    id: validated.region_id,
    object: "region",
    deleted: true,
  })
}

export class AdminDeleteRegionParams {
  @IsString()
  region_id: string
}

import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."
import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { IsString } from "class-validator"

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
    AdminDeleteRegionsRegionMetadataKeyReq,
    req.params
  )

  const { id, key } = validated

  const regionService: RegionService = req.scope.resolve("regionService")
  await regionService.deleteMetadata(id, key)

  const region: Region = await regionService.retrieve(id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.status(200).json({ region })
}

export class AdminDeleteRegionsRegionMetadataKeyReq {
  @IsString()
  id: string
  @IsString()
  key: string
}

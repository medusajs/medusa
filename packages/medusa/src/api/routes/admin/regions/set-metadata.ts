import { defaultFields, defaultRelations } from "."
import { validator } from "medusa-core-utils"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"

/**
 * @oas [delete] /regions/{id}/payment-providers/{provider_id}
 * operationId: "PostRegionsRegionPaymentProvidersProvider"
 * summary: "Set the metadata of a Region"
 * description: "Sets the metadata of a Region"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (body) key=* {string} Key for the metadata value.
 *   - (body) value=* {string} The value that the key relates to.
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
  const { id } = req.params

  const validated = await validator(AdminRegionSetMetadataRequest, req.body)

  const regionService = req.scope.resolve("regionService") as RegionService
  await regionService.setMetadata(id, validated.key, validated.value)

  const region: Region = await regionService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ region })
}

export class AdminRegionSetMetadataRequest {
  key: string
  value: string
}

export class AdminRegionSetMetadataResponse {
  region: Region
}

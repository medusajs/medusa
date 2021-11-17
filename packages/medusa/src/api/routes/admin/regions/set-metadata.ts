import { IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
import RegionService from "../../../../services/region"
import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

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

  const validated = await validator(
    AdminPostRegionsRegionPaymentProvidersProviderReq,
    req.body
  )

  const regionService: RegionService = req.scope.resolve("regionService")
  await regionService.setMetadata(id, validated.key, validated.value)

  const region = await regionService.retrieve(id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.status(200).json({ region })
}

export class AdminPostRegionsRegionPaymentProvidersProviderReq {
  @IsString()
  key: string

  @IsString()
  value: string
}

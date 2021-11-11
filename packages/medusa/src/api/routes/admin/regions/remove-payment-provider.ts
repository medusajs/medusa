import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."
import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { IsString } from "class-validator"

/**
 * @oas [delete] /regions/{id}/payment-providers/{provider_id}
 * operationId: "PostRegionsRegionPaymentProvidersProvider"
 * summary: "Remove Payment Provider"
 * description: "Removes a Payment Provider."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) provider_id=* {string} The id of the Payment Provider.
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
  const { region_id, provider_id } = await validator(
    AdminPostRegionsRegionPaymentProvidersProviderReq,
    req.params
  )

  const regionService: RegionService = req.scope.resolve("regionService")
  await regionService.removePaymentProvider(region_id, provider_id)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.json({ region })
}

export class AdminPostRegionsRegionPaymentProvidersProviderReq {
  @IsString()
  region_id: string
  @IsString()
  provider_id: string
}

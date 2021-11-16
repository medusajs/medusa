import { IsString } from "class-validator"
import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."
import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"

/**
 * @oas [post] /regions/{id}/payment-providers
 * operationId: "PostRegionsRegionPaymentProviders"
 * summary: "Add Payment Provider"
 * description: "Adds a Payment Provider to a Region"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - provider_id
 *       schema:
 *         properties:
 *           provider_id:
 *             description: "The id of the Payment Provider to add."
 *             type: string
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
  const { region_id } = req.params
  const validated = await validator(
    AdminPostRegionsRegionPaymentProvidersReq,
    req.body
  )

  const regionService: RegionService = req.scope.resolve("regionService")
  await regionService.addPaymentProvider(region_id, validated.provider_id)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })
  res.status(200).json({ region })
}

export class AdminPostRegionsRegionPaymentProvidersReq {
  @IsString()
  provider_id: string
}

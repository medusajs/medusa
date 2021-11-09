import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
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
  const validated = await validator(
    AdminRemovePaymentProviderFromRegionRequest,
    req.params
  )

  const { region_id, provider_id } = validated
  const regionService = req.scope.resolve("regionService") as RegionService
  await regionService.removePaymentProvider(region_id, provider_id)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ region })
}

export class AdminRemovePaymentProviderFromRegionRequest {
  @IsString()
  region_id: string
  @IsString()
  provider_id: string
}

export class AdminRemovePaymentProviderFromRegionResponse {
  region: Region
}

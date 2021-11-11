import { defaultRelations, defaultFields } from "."
import { validator } from "../../../../utils/validator"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"
import { IsString } from "class-validator"

/**
 * @oas [delete] /regions/{id}/fulfillment-providers/{provider_id}
 * operationId: "PostRegionsRegionFulfillmentProvidersProvider"
 * summary: "Remove Fulfillment Provider"
 * description: "Removes a Fulfillment Provider."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 *   - (path) provider_id=* {string} The id of the Fulfillment Provider.
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
    AdminPostRegionsRegionFulfillmentProvidersProviderReq,
    req.params
  )
  const { region_id, provider_id } = validated
  const regionService: RegionService = req.scope.resolve("regionService")

  await regionService.removeFulfillmentProvider(region_id, provider_id)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ region })
}

export class AdminPostRegionsRegionFulfillmentProvidersProviderReq {
  @IsString()
  region_id: string
  @IsString()
  provider_id: string
}

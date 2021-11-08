import { defaultRelations, defaultFields } from "."
import { validator } from "medusa-core-utils"
import { Region } from "../../../.."
import RegionService from "../../../../services/region"

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
    AdminRemoveFulfillmentProviderFromRegionRequest,
    req.params
  )
  const { region_id, provider_id } = validated
  const regionService = req.scope.resolve("regionService") as RegionService

  await regionService.removeFulfillmentProvider(region_id, provider_id)

  const region: Region = await regionService.retrieve(region_id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ region })
}

export class AdminRemoveFulfillmentProviderFromRegionRequest {
  region_id: string
  provider_id: string
}

export class AdminRemoveFulfillmentProviderFromRegionResponse {
  region: Region
}

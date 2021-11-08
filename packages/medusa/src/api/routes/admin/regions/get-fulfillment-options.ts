import { validator } from "medusa-core-utils"
import Region from "../../../.."
import RegionService from "../../../../services/region"
import FulfillmentProviderService from "../../../../services/fulfillment-provider"

/**
 * @oas [get] /regions/{id}/fulfillment-options
 * operationId: "GetRegionsRegionFulfillmentOptions"
 * summary: "List Fulfillment Options available in the Region"
 * description: "Gathers all the fulfillment options available to in the Region."
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
 *             fulfillment_options:
 *               type: array
 *               items:
 *                 type: object
 */
export default async (req, res) => {
  const { region_id } = req.params

  const fulfillmentProviderService = req.scope.resolve(
    "fulfillmentProviderService"
  ) as FulfillmentProviderService
  const regionService = req.scope.resolve("regionService") as RegionService
  const region: Region = await regionService.retrieve(region_id, {
    relations: ["fulfillment_providers"],
  })

  const fpsIds = region.fulfillment_providers.map((fp) => fp.id) || []

  const options: FulfillmentOption[] =
    await fulfillmentProviderService.listFulfillmentOptions(fpsIds)

  res.status(200).json({
    fulfillment_options: options,
  })
}

export class FulfillmentOption {
  provider_id: string
  options: any[]
}

export class AdminRegionFulfillmentOptionsResponse {
  fulfillment_options: FulfillmentOption[]
}

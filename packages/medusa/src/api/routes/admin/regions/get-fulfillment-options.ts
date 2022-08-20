import { FulfillmentOption } from "."
import FulfillmentProviderService from "../../../../services/fulfillment-provider"
import RegionService from "../../../../services/region"

/**
 * @oas [get] /regions/{id}/fulfillment-options
 * operationId: "GetRegionsRegionFulfillmentOptions"
 * summary: "List Fulfillment Options available in the Region"
 * description: "Gathers all the fulfillment options available to in the Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
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
 *                 properties:
 *                   provider_id:
 *                     type: string
 *                     description: ID of the fulfillment provider
 *                   options:
 *                     type: array
 *                     description: fulfillment provider options
 *                     example:
 *                       - id: "manual-fulfillment"
 *                       - id: "manual-fulfillment-return"
 *                         is_return: true
 */
export default async (req, res) => {
  const { region_id } = req.params

  const fulfillmentProviderService: FulfillmentProviderService =
    req.scope.resolve("fulfillmentProviderService")

  const regionService: RegionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(region_id, {
    relations: ["fulfillment_providers"],
  })

  const fpsIds = region.fulfillment_providers.map((fp) => fp.id) || []

  const options: FulfillmentOption[] =
    await fulfillmentProviderService.listFulfillmentOptions(fpsIds)

  res.status(200).json({
    fulfillment_options: options,
  })
}

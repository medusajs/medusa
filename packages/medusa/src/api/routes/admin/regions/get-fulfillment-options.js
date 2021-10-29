/**
 * @oas [get] /regions/{id}/fulfillment-options
 * operationId: "GetRegionsRegionFulfillmentOptions"
 * summary: "List Fulfillment Options available in the Region"
 * description: "Gathers all the fulfillment options available to in the Region."
 * parameters:
 *   - (path) id=* {string} The id of the Region.
 * tags:
 *   - Product
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
  )
  const regionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(region_id, {
    relations: ["fulfillment_providers"],
  })

  const fpsIds = region.fulfillment_providers.map((fp) => fp.id) || []

  const options = await fulfillmentProviderService.listFulfillmentOptions(
    fpsIds
  )

  res.status(200).json({
    fulfillment_options: options,
  })
}

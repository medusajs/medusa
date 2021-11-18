import RegionService from "../../../../services/region"
import { defaultAdminRegionRelations, defaultAdminRegionFields } from "."

/**
 * @oas [delete] /regions/{id}/fulfillment-providers/{provider_id}
 * operationId: "PostRegionsRegionFulfillmentProvidersProvider"
 * summary: "Remove Fulfillment Provider"
 * description: "Removes a Fulfillment Provider."
 * x-authenticated: true
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
  const { region_id, provider_id } = req.params
  const regionService: RegionService = req.scope.resolve("regionService")

  await regionService.removeFulfillmentProvider(region_id, provider_id)

  const region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.json({ region })
}

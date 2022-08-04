import { defaultAdminRegionFields, defaultAdminRegionRelations } from "."

import { EntityManager } from "typeorm"
import RegionService from "../../../../services/region"

/**
 * @oas [delete] /regions/{id}/fulfillment-providers/{provider_id}
 * operationId: "PostRegionsRegionFulfillmentProvidersProvider"
 * summary: "Remove Fulfillment Provider"
 * description: "Removes a Fulfillment Provider."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 *   - (path) provider_id=* {string} The ID of the Fulfillment Provider.
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

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await regionService
      .withTransaction(transactionManager)
      .removeFulfillmentProvider(region_id, provider_id)
  })

  const region = await regionService.retrieve(region_id, {
    select: defaultAdminRegionFields,
    relations: defaultAdminRegionRelations,
  })

  res.json({ region })
}

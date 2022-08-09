import { EntityManager } from "typeorm"
import RegionService from "../../../../services/region"

/**
 * @oas [delete] /regions/{id}
 * operationId: "DeleteRegionsRegion"
 * summary: "Delete a Region"
 * description: "Deletes a Region."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Region.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.regions.delete(region_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/regions/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Region.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: region
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req, res) => {
  const { region_id } = req.params

  const regionService: RegionService = req.scope.resolve("regionService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await regionService
      .withTransaction(transactionManager)
      .delete(region_id)
  })

  res.status(200).json({
    id: region_id,
    object: "region",
    deleted: true,
  })
}

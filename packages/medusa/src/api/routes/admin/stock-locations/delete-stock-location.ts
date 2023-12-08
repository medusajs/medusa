import { IInventoryService, IStockLocationService } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { SalesChannelLocationService } from "../../../../services"

/**
 * @oas [delete] /admin/stock-locations/{id}
 * operationId: "DeleteStockLocationsStockLocation"
 * summary: "Delete a Stock Location"
 * description: "Delete a Stock Location."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Stock Location.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.stockLocations.delete(stockLocationId)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/stock-locations/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Stock Locations
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStockLocationsDeleteRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const stockLocationService: IStockLocationService = req.scope.resolve(
    "stockLocationService"
  )

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const salesChannelLocationService: SalesChannelLocationService =
    req.scope.resolve("salesChannelLocationService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await salesChannelLocationService
      .withTransaction(transactionManager)
      .removeLocation(id)

    await stockLocationService.delete(id)

    if (inventoryService) {
      await promiseAll([
        inventoryService.deleteInventoryItemLevelByLocationId(id),
        inventoryService.deleteReservationItemByLocationId(id),
      ])
    }
  })

  res.status(200).send({
    id,
    object: "stock_location",
    deleted: true,
  })
}

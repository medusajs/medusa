import { IInventoryService } from "@medusajs/types"
import { Request, Response } from "express"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/inventory-items/{id}/location-levels
 * operationId: "GetInventoryItemsInventoryItemLocationLevels"
 * summary: "List Inventory Levels"
 * description: "Lists inventory levels of an inventory item."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codegen:
 *   method: listLocationLevels
 *   queryParams: AdminGetInventoryItemsItemLocationLevelsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.listLocationLevels(inventoryItemId)
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.location_levels);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/inventory-items/{id}/location-levels' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Inventory Items
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInventoryItemsLocationLevelsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const [levels] = await inventoryService.listInventoryLevels(
    {
      inventory_item_id: id,
    },
    req.retrieveConfig
  )

  res.status(200).json({
    inventory_item: {
      id,
      location_levels: levels,
    },
  })
}

// eslint-disable-next-line max-len
export class AdminGetInventoryItemsItemLocationLevelsParams extends FindParams {}

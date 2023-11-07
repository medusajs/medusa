import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { FindParams } from "../../../../types/common"
import { IInventoryService } from "@medusajs/types"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /admin/inventory-items/{id}/location-levels
 * operationId: "GetInventoryItemsInventoryItemLocationLevels"
 * summary: "List Inventory Level"
 * description: "Retrieve a list of inventory levels of an inventory item. The inventory levels can be filtered by fields such as `location_id`."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item the locations are associated with.
 *   - in: query
 *     name: location_id
 *     style: form
 *     explode: false
 *     description: Filter by location IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned inventory levels.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned inventory levels.
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
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/inventory-items/{id}/location-levels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
      ...req.filterableFields,
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
export class AdminGetInventoryItemsItemLocationLevelsParams extends FindParams {
  /**
   * Location IDs to filter location levels.
   */
  @IsOptional()
  @IsString({ each: true })
  location_id?: string[]
}

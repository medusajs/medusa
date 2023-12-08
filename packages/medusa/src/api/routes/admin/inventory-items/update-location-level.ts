import { IInventoryService } from "@medusajs/types"
import { IsNumber, IsOptional, Min } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/inventory-items/{id}/location-levels/{location_id}
 * operationId: "PostInventoryItemsInventoryItemLocationLevelsLocationLevel"
 * summary: "Update a Location Level"
 * description: "Update a Location Level's details for a given Inventory Item."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item that the location is associated with.
 *   - (path) location_id=* {string} The ID of the Location to update.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned location level.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned location level.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInventoryItemsItemLocationLevelsLevelReq"
 * x-codegen:
 *   method: updateLocationLevel
 *   queryParams: AdminPostInventoryItemsItemLocationLevelsLevelParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.updateLocationLevel(inventoryItemId, locationId, {
 *         stocked_quantity: 15,
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels/{location_id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "stocked_quantity": 15
 *       }'
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
 *           $ref: "#/components/schemas/AdminInventoryItemsRes"
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
  const { id, location_id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const manager: EntityManager = req.scope.resolve("manager")

  const validatedBody =
    req.validatedBody as AdminPostInventoryItemsItemLocationLevelsLevelReq

  await inventoryService.updateInventoryLevel(id, location_id, validatedBody)

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

/**
 * @schema AdminPostInventoryItemsItemLocationLevelsLevelReq
 * type: object
 * properties:
 *   stocked_quantity:
 *     description: the total stock quantity of an inventory item at the given location ID
 *     type: number
 *   incoming_quantity:
 *     description: the incoming stock quantity of an inventory item at the given location ID
 *     type: number
 */
export class AdminPostInventoryItemsItemLocationLevelsLevelReq {
  @IsOptional()
  @IsNumber()
  @Min(0)
  incoming_quantity?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  stocked_quantity?: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsLevelParams extends FindParams {}

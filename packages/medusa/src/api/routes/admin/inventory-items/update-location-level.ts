import { IInventoryService } from "@medusajs/types"
import { IsNumber, IsOptional, Min } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/inventory-items/{id}/location-levels/{location_id}
 * operationId: "PostInventoryItemsInventoryItemLocationLevelsLocationLevel"
 * summary: "Update an Inventory Level"
 * description: "Updates an Inventory Level for a given Inventory Item."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item.
 *   - (path) location_id=* {string} The ID of the Location.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/inventory-items/{id}/location-levels/{location_id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "stocked_quantity": 15
 *       }'
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

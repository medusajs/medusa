import { IInventoryService, IStockLocationService } from "@medusajs/types"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/inventory-items/{id}/location-levels
 * operationId: "PostInventoryItemsInventoryItemLocationLevels"
 * summary: "Create an Inventory Level"
 * description: "Create an Inventory Level for a given Inventory Item."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned inventory item.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned inventory item.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInventoryItemsItemLocationLevelsReq"
 * x-codegen:
 *   method: createLocationLevel
 *   queryParams: AdminPostInventoryItemsItemLocationLevelsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.createLocationLevel(inventoryItemId, {
 *         location_id: "sloc_123",
 *         stocked_quantity: 10,
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCreateLocationLevel } from "medusa-react"
 *
 *       type Props = {
 *         inventoryItemId: string
 *       }
 *
 *       const InventoryItem = ({ inventoryItemId }: Props) => {
 *         const createLocationLevel = useAdminCreateLocationLevel(
 *           inventoryItemId
 *         )
 *         // ...
 *
 *         const handleCreateLocationLevel = (
 *           locationId: string,
 *           stockedQuantity: number
 *         ) => {
 *           createLocationLevel.mutate({
 *             location_id: locationId,
 *             stocked_quantity: stockedQuantity,
 *           }, {
 *             onSuccess: ({ inventory_item }) => {
 *               console.log(inventory_item.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default InventoryItem
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "location_id": "sloc_123",
 *           "stocked_quantity": 10
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
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const stockLocationService: IStockLocationService | undefined =
    req.scope.resolve("stockLocationService")

  const validatedBody =
    req.validatedBody as AdminPostInventoryItemsItemLocationLevelsReq

  const location_id = validatedBody.location_id
  if (stockLocationService) {
    // will throw an error if not found
    await stockLocationService.retrieve(location_id)
  }

  await inventoryService.createInventoryLevel({
    inventory_item_id: id,
    location_id,
    stocked_quantity: validatedBody.stocked_quantity,
    incoming_quantity: validatedBody.incoming_quantity,
  })

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

/**
 * @schema AdminPostInventoryItemsItemLocationLevelsReq
 * type: object
 * description: "The details of the inventory level to create."
 * required:
 *   - location_id
 *   - stocked_quantity
 * properties:
 *   location_id:
 *     description: the ID of the stock location
 *     type: string
 *   stocked_quantity:
 *     description: the stock quantity of the inventory item at this location
 *     type: number
 *   incoming_quantity:
 *     description: the incoming stock quantity of the inventory item at this location
 *     type: number
 */
export class AdminPostInventoryItemsItemLocationLevelsReq {
  @IsString()
  location_id: string

  @IsNumber()
  stocked_quantity: number

  @IsOptional()
  @IsNumber()
  incoming_quantity?: number
}

// eslint-disable-next-line
export class AdminPostInventoryItemsItemLocationLevelsParams extends FindParams {}

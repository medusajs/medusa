import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { IInventoryService } from "@medusajs/types"

/**
 * @oas [post] /admin/inventory-items/{id}
 * operationId: "PostInventoryItemsInventoryItem"
 * summary: "Update an Inventory Item"
 * description: "Update an Inventory Item's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned inventory level.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned inventory level.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInventoryItemsInventoryItemReq"
 * x-codegen:
 *   method: update
 *   queryParams: AdminPostInventoryItemsInventoryItemParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.update(inventoryItemId, {
 *         origin_country: "US",
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "origin_country": "US"
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
  const manager: EntityManager = req.scope.resolve("manager")

  await inventoryService.updateInventoryItem(
    id,
    req.validatedBody as AdminPostInventoryItemsInventoryItemReq
  )

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

/**
 * @schema AdminPostInventoryItemsInventoryItemReq
 * type: object
 * description: "The attributes to update in an inventory item."
 * properties:
 *   hs_code:
 *     description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   origin_country:
 *     description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   material:
 *     description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   weight:
 *     description: The weight of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   height:
 *     description: The height of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   width:
 *     description: The width of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   length:
 *     description: The length of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   title:
 *     description: The inventory item's title.
 *     type: string
 *   description:
 *     description: The inventory item's description.
 *     type: string
 *   thumbnail:
 *     description: The inventory item's thumbnail.
 *     type: string
 *   requires_shipping:
 *     description: Whether the item requires shipping.
 *     type: boolean
 */

export class AdminPostInventoryItemsInventoryItemReq {
  @IsString()
  @IsOptional()
  sku?: string

  @IsOptional()
  @IsString()
  origin_country?: string

  @IsOptional()
  @IsString()
  hs_code?: string

  @IsOptional()
  @IsString()
  mid_code?: string

  @IsOptional()
  @IsString()
  material?: string

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  height?: number

  @IsOptional()
  @IsNumber()
  length?: number

  @IsOptional()
  @IsNumber()
  width?: number

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsBoolean()
  @IsOptional()
  requires_shipping?: boolean
}

export class AdminPostInventoryItemsInventoryItemParams extends FindParams {}

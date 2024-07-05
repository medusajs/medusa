import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import {
  NumericalComparisonOperator,
  StringComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { joinLevels } from "./utils/join-levels"
import { joinVariants } from "./utils/join-variants"

import { IInventoryService } from "@medusajs/types"
import { Transform } from "class-transformer"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /admin/inventory-items
 * operationId: "GetInventoryItems"
 * summary: "List Inventory Items"
 * description: "Retrieve a list of inventory items. The inventory items can be filtered by fields such as `q` or `location_id`. The inventory items can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of inventory items to skip when retrieving the inventory items.
 *   - (query) limit=20 {integer} Limit the number of inventory items returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded in each returned inventory item.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned inventory item.
 *   - (query) q {string} term to search inventory item's sku, title, and description.
 *   - (query) order {string} Field to sort-order inventory items by.
 *   - in: query
 *     name: location_id
 *     style: form
 *     explode: false
 *     description: Filter by location IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by the inventory ID
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: inventory ID
 *         - type: array
 *           description: an array of inventory IDs
 *           items:
 *             type: string
 *   - (query) sku {string} Filter by SKU
 *   - (query) origin_country {string} Filter by origin country
 *   - (query) mid_code {string} Filter by MID code
 *   - (query) material {string} Filter by material
 *   - (query) hs_code {string} Filter by HS Code
 *   - (query) weight {string} Filter by weight
 *   - (query) length {string} Filter by length
 *   - (query) height {string} Filter by height
 *   - (query) width {string} Filter by width
 *   - (query) requires_shipping {string} Filter by whether the item requires shipping
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetInventoryItemsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.list()
 *       .then(({ inventory_items, count, offset, limit }) => {
 *         console.log(inventory_items.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminInventoryItems } from "medusa-react"
 *
 *       function InventoryItems() {
 *         const {
 *           inventory_items,
 *           isLoading
 *         } = useAdminInventoryItems()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {inventory_items && !inventory_items.length && (
 *               <span>No Items</span>
 *             )}
 *             {inventory_items && inventory_items.length > 0 && (
 *               <ul>
 *                 {inventory_items.map(
 *                   (item) => (
 *                     <li key={item.id}>{item.id}</li>
 *                   )
 *                 )}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default InventoryItems
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/inventory-items' \
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
 *           $ref: "#/components/schemas/AdminInventoryItemsListWithVariantsAndLocationLevelsRes"
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
  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  let locationIds: string[] = []

  if (filterableFields.location_id) {
    locationIds = Array.isArray(filterableFields.location_id)
      ? filterableFields.location_id
      : [filterableFields.location_id]
  }

  const [inventoryItems, count] = await inventoryService.listInventoryItems(
    filterableFields,
    listConfig
  )

  const inventory_items = await joinVariants(
    inventoryItems,
    productVariantInventoryService,
    productVariantService
  ).then(async (res) => {
    return await joinLevels(res, locationIds, inventoryService)
  })

  res.status(200).json({
    inventory_items,
    count,
    offset: skip,
    limit: take,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved inventory items.
 */
export class AdminGetInventoryItemsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Search terms to search inventory items' sku, title, and description.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * Location IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

  /**
   * SKUs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  sku?: string | string[]

  /**
   * Origin countries to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  origin_country?: string | string[]

  /**
   * MID codes to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  mid_code?: string | string[]

  /**
   * Materials to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  material?: string | string[]

  /**
   * String filters to apply to inventory items' `hs_code` field.
   */
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  hs_code?: string | string[] | StringComparisonOperator

  /**
   * Number filters to apply to inventory items' `weight` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `length` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `height` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  /**
   * Number filters to apply to inventory items' `width` field.
   */
  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  /**
   * Filter inventory items by whether they require shipping.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  requires_shipping?: boolean
}

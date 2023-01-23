import { Request, Response } from "express"
import { IsString, IsBoolean, IsOptional } from "class-validator"
import { Transform } from "class-transformer"
import { IsType } from "../../../../utils/validators/is-type"
import { getLevelsByInventoryItemId } from "./utils/join-levels"
import {
  getVariantsByInventoryItemId,
  InventoryItemsWithVariants,
} from "./utils/join-variants"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import { IInventoryService } from "../../../../interfaces"
import {
  extendedFindParamsMixin,
  StringComparisonOperator,
  NumericalComparisonOperator,
} from "../../../../types/common"
import { AdminInventoryItemsListWithVariantsAndLocationLevelsRes } from "."

/**
 * @oas [get] /inventory-items
 * operationId: "GetInventoryItems"
 * summary: "List inventory items."
 * description: "Lists inventory items."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} How many inventory items to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of inventory items returned.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 *   - (query) q {string} Query used for searching product inventory items and their properties.
 *   - in: query
 *     name: location_id
 *     style: form
 *     explode: false
 *     description: Locations ids to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) id {string} id to search for.
 *   - (query) sku {string} sku to search for.
 *   - (query) origin_country {string} origin_country to search for.
 *   - (query) mid_code {string} mid_code to search for.
 *   - (query) material {string} material to search for.
 *   - (query) hs_code {string} hs_code to search for.
 *   - (query) weight {string} weight to search for.
 *   - (query) length {string} length to search for.
 *   - (query) height {string} height to search for.
 *   - (query) width {string} width to search for.
 *   - (query) requires_shipping {string} requires_shipping to search for.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.list()
 *       .then(({ inventory_items }) => {
 *         console.log(inventory_items.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/inventory-items' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json'
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

  const levelsByItemId = await getLevelsByInventoryItemId(
    inventoryItems,
    locationIds,
    inventoryService
  )

  const variantsByInventoryItemId: InventoryItemsWithVariants =
    await getVariantsByInventoryItemId(
      inventoryItems,
      productVariantInventoryService,
      productVariantService
    )

  const inventoryItemsWithVariantsAndLocationLevels = inventoryItems.map(
    (
      inventoryItem
    ): AdminInventoryItemsListWithVariantsAndLocationLevelsRes => {
      return {
        ...inventoryItem,
        variants: variantsByInventoryItemId[inventoryItem.id] ?? [],
        location_levels: levelsByItemId[inventoryItem.id] ?? [],
      }
    }
  )

  res.status(200).json({
    inventory_items: inventoryItemsWithVariantsAndLocationLevels,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetInventoryItemsParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsType([String, [String]])
  location_id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  sku?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  origin_country?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  mid_code?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  material?: string | string[]

  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  hs_code?: string | string[] | StringComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  weight?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  length?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  height?: number | NumericalComparisonOperator

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  width?: number | NumericalComparisonOperator

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  requires_shipping?: boolean
}

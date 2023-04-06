import { IInventoryService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import { FindParams } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { createInventoryItemTransaction } from "./transaction/create-inventory-item"

/**
 * @oas [post] /admin/inventory-items
 * operationId: "PostInventoryItems"
 * summary: "Create an Inventory Item"
 * description: "Creates an Inventory Item."
 * x-authenticated: true
 * parameters:
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostInventoryItemsReq"
 * x-codegen:
 *   method: create
 *   queryParams: AdminPostInventoryItemsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.create({
 *         variant_id: 'variant_123',
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/inventory-items' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "variant_id": "variant_123",
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

export default async (req, res) => {
  const validated = await validator(AdminPostInventoryItemsReq, req.body)
  const { variant_id, ...input } = validated

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  let inventoryItems = await productVariantInventoryService.listByVariant(
    variant_id
  )

  // TODO: this is a temporary fix to prevent duplicate inventory items since we don't support this functionality yet
  if (inventoryItems.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Inventory Item already exists for this variant"
    )
  }

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await createInventoryItemTransaction(
      {
        manager: transactionManager,
        inventoryService,
        productVariantInventoryService,
        productVariantService,
      },
      variant_id,
      input
    )
  })

  inventoryItems = await productVariantInventoryService.listByVariant(
    variant_id
  )

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    inventoryItems[0].inventory_item_id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

/**
 * @schema AdminPostInventoryItemsReq
 * type: object
 * properties:
 *   sku:
 *     description: The unique SKU for the Product Variant.
 *     type: string
 *   ean:
 *     description: The EAN number of the item.
 *     type: string
 *   upc:
 *     description: The UPC number of the item.
 *     type: string
 *   barcode:
 *     description: A generic GTIN field for the Product Variant.
 *     type: string
 *   hs_code:
 *     description: The Harmonized System code for the Product Variant.
 *     type: string
 *   inventory_quantity:
 *     description: The amount of stock kept for the Product Variant.
 *     type: integer
 *     default: 0
 *   allow_backorder:
 *     description: Whether the Product Variant can be purchased when out of stock.
 *     type: boolean
 *   manage_inventory:
 *     description: Whether Medusa should keep track of the inventory for this Product Variant.
 *     type: boolean
 *     default: true
 *   weight:
 *     description: The wieght of the Product Variant.
 *     type: number
 *   length:
 *     description: The length of the Product Variant.
 *     type: number
 *   height:
 *     description: The height of the Product Variant.
 *     type: number
 *   width:
 *     description: The width of the Product Variant.
 *     type: number
 *   origin_country:
 *     description: The country of origin of the Product Variant.
 *     type: string
 *   mid_code:
 *     description: The Manufacturer Identification code for the Product Variant.
 *     type: string
 *   material:
 *     description: The material composition of the Product Variant.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
export class AdminPostInventoryItemsReq {
  @IsString()
  variant_id: string

  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostInventoryItemsParams extends FindParams {}

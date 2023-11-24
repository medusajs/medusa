import {
  FlagRouter,
  ManyToManyInventoryFeatureFlag,
  MedusaError,
} from "@medusajs/utils"
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import {
  CreateInventoryItemActions,
  createInventoryItems,
} from "@medusajs/core-flows"
import { pipe } from "@medusajs/workflows-sdk"
import { ProductVariantInventoryService } from "../../../../services"

import { FindParams } from "../../../../types/common"

/**
 * @oas [post] /admin/inventory-items
 * operationId: "PostInventoryItems"
 * summary: "Create an Inventory Item"
 * description: "Create an Inventory Item for a product variant."
 * x-authenticated: true
 * parameters:
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned inventory item.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned inventory item.
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
 *         variant_id: "variant_123",
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/inventory-items' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "variant_id": "variant_123",
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

export default async (req, res) => {
  const { variant_id, ...inventoryItemInput } = req.validatedBody

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const createInventoryItemWorkflow = createInventoryItems(req.scope)

  if (!featureFlagRouter.isFeatureEnabled(ManyToManyInventoryFeatureFlag.key)) {
    if (!variant_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "variant_id is required"
      )
    }

    createInventoryItemWorkflow.appendAction(
      "attachInventoryItems",
      CreateInventoryItemActions.createInventoryItems,
      {
        invoke: pipe(
          {
            invoke: {
              from: CreateInventoryItemActions.createInventoryItems,
              alias: "createdItems",
            },
          },
          generateAttachInventoryToVariantHandler(
            variant_id,
            productVariantInventoryService
          )
        ),
        compensate: pipe(
          {
            invoke: {
              from: "attachInventoryItems",
              alias: "attachedItems",
            },
          },
          generateDetachInventoryItemFromVariantHandler(
            productVariantInventoryService
          )
        ),
      }
    )
  }

  const { result } = await createInventoryItemWorkflow.run({
    input: {
      inventoryItems: [inventoryItemInput],
    },
  })

  res.status(200).json({ inventory_item: result[0].inventoryItem })
}

function generateDetachInventoryItemFromVariantHandler(
  productVariantInventoryService: ProductVariantInventoryService
) {
  return async ({ data }) => {
    if (!data.attachedItems || !data.attachedItems.length) {
      return
    }

    const [variantId, inventoryItemId] = data.attachedItems
    if (!variantId || !inventoryItemId) {
      return
    }

    return await productVariantInventoryService.detachInventoryItem(
      inventoryItemId,
      variantId
    )
  }
}

function generateAttachInventoryToVariantHandler(
  variantId: string,
  productVariantInventoryService: ProductVariantInventoryService
) {
  return async ({ data }) => {
    const inventoryItems = await productVariantInventoryService.listByVariant(
      variantId
    )

    // TODO: this is a temporary fix to prevent duplicate inventory
    // items since we don't support this functionality yet
    if (inventoryItems.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Inventory Item already exists for this variant"
      )
    }
    const inventoryItemId = data.createdItems[0].inventoryItem.id
    await productVariantInventoryService.attachInventoryItem(
      variantId,
      inventoryItemId
    )
    return [variantId, inventoryItemId]
  }
}

/**
 * @schema AdminPostInventoryItemsReq
 * type: object
 * required:
 *   - variant_id
 * properties:
 *   variant_id:
 *     description: The ID of the variant to create the inventory item for.
 *     type: string
 *   sku:
 *     description: The unique SKU of the associated Product Variant.
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
 *     description: The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   inventory_quantity:
 *     description: The amount of stock kept of the associated Product Variant.
 *     type: integer
 *     default: 0
 *   allow_backorder:
 *     description: Whether the associated Product Variant can be purchased when out of stock.
 *     type: boolean
 *   manage_inventory:
 *     description: Whether Medusa should keep track of the inventory for the associated Product Variant.
 *     type: boolean
 *     default: true
 *   weight:
 *     description: The weight of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   length:
 *     description: The length of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   height:
 *     description: The height of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   width:
 *     description: The width of the Inventory Item. May be used in shipping rate calculations.
 *     type: number
 *   origin_country:
 *     description: The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   material:
 *     description: The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     type: string
 *   title:
 *     description: The inventory item's title.
 *     type: string
 *   description:
 *     description: The inventory item's description.
 *     type: string
 *   thumbnail:
 *     description: The inventory item's thumbnail.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class AdminPostInventoryItemsReq {
  @IsOptional()
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

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostInventoryItemsParams extends FindParams {}

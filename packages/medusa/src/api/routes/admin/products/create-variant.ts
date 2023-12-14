import { CreateProductVariants } from "@medusajs/core-flows"
import { IInventoryService, WorkflowTypes } from "@medusajs/types"
import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { EntityManager } from "typeorm"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
  defaultAdminProductRemoteQueryObject,
} from "."
import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import {
  CreateProductVariantInput,
  ProductVariantPricesCreateReq,
} from "../../../../types/product-variant"
import { retrieveProduct, validator } from "../../../../utils"
import { createVariantsTransaction } from "./transaction/create-product-variant"

/**
 * @oas [post] /admin/products/{id}/variants
 * operationId: "PostProductsProductVariants"
 * summary: "Create a Product Variant"
 * description: "Create a Product Variant associated with a Product. Each product variant must have a unique combination of Product Option values."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductVariantsReq"
 * x-codegen:
 *   method: createVariant
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.createVariant(productId, {
 *         title: "Color",
 *         prices: [
 *           {
 *             amount: 1000,
 *             currency_code: "eur"
 *           }
 *         ],
 *         options: [
 *           {
 *             option_id,
 *             value: "S"
 *           }
 *         ],
 *         inventory_quantity: 100
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/products/{id}/variants' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Color",
 *           "prices": [
 *             {
 *               "amount": 1000,
 *               "currency_code": "eur"
 *             }
 *           ],
 *           "options": [
 *             {
 *               "option_id": "asdasf",
 *               "value": "S"
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsRes"
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
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductVariantsReq,
    req.body
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const pricingService: PricingService = req.scope.resolve("pricingService")
  let rawProduct

  if (featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    const createVariantsWorkflow = CreateProductVariants.createProductVariants(
      req.scope
    )

    const input = {
      productVariants: [
        {
          product_id: id,
          ...validated,
        },
      ] as WorkflowTypes.ProductWorkflow.CreateProductVariantsInputDTO[],
    }

    await createVariantsWorkflow.run({
      input,
      context: {
        manager,
      },
    })

    rawProduct = await retrieveProduct(
      req.scope,
      id,
      defaultAdminProductRemoteQueryObject
    )
  } else {
    await manager.transaction(async (transactionManager) => {
      await createVariantsTransaction(
        {
          manager: transactionManager,
          inventoryService,
          productVariantInventoryService,
          productVariantService,
        },
        id,
        [validated as CreateProductVariantInput]
      )
    })

    const productService: ProductService = req.scope.resolve("productService")

    rawProduct = await productService.retrieve(id, {
      select: defaultAdminProductFields,
      relations: defaultAdminProductRelations,
    })
  }

  const [product] = await pricingService.setAdminProductPricing([rawProduct])

  res.json({ product })
}

class ProductVariantOptionReq {
  @IsString()
  value: string

  @IsString()
  option_id: string
}

/**
 * @schema AdminPostProductsProductVariantsReq
 * type: object
 * required:
 *   - title
 *   - prices
 *   - options
 * properties:
 *   title:
 *     description: The title of the product variant.
 *     type: string
 *   sku:
 *     description: The unique SKU of the product variant.
 *     type: string
 *   ean:
 *     description: The EAN number of the product variant.
 *     type: string
 *   upc:
 *     description: The UPC number of the product variant.
 *     type: string
 *   barcode:
 *     description: A generic GTIN field of the product variant.
 *     type: string
 *   hs_code:
 *     description: The Harmonized System code of the product variant.
 *     type: string
 *   inventory_quantity:
 *     description: The amount of stock kept of the product variant.
 *     type: integer
 *     default: 0
 *   allow_backorder:
 *     description: Whether the product variant can be purchased when out of stock.
 *     type: boolean
 *   manage_inventory:
 *     description: Whether Medusa should keep track of the inventory of this product variant.
 *     type: boolean
 *     default: true
 *   weight:
 *     description: The wieght of the product variant.
 *     type: number
 *   length:
 *     description: The length of the product variant.
 *     type: number
 *   height:
 *     description: The height of the product variant.
 *     type: number
 *   width:
 *     description: The width of the product variant.
 *     type: number
 *   origin_country:
 *     description: The country of origin of the product variant.
 *     type: string
 *   mid_code:
 *     description: The Manufacturer Identification code of the product variant.
 *     type: string
 *   material:
 *     description: The material composition of the product variant.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *   prices:
 *     type: array
 *     description: An array of product variant prices. A product variant can have different prices for each region or currency code.
 *     externalDocs:
 *       url: https://docs.medusajs.com/modules/products/admin/manage-products#product-variant-prices
 *       description: Product variant pricing.
 *     items:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         region_id:
 *           description: The ID of the Region the price will be used in. This is only required if `currency_code` is not provided.
 *           type: string
 *         currency_code:
 *           description: The 3 character ISO currency code the price will be used in. This is only required if `region_id` is not provided.
 *           type: string
 *           externalDocs:
 *             url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *             description: See a list of codes.
 *         amount:
 *           description: The price amount.
 *           type: integer
 *         min_quantity:
 *          description: The minimum quantity required to be added to the cart for the price to be used.
 *          type: integer
 *         max_quantity:
 *           description: The maximum quantity required to be added to the cart for the price to be used.
 *           type: integer
 *   options:
 *     type: array
 *     description: An array of Product Option values that the variant corresponds to.
 *     items:
 *       type: object
 *       required:
 *         - option_id
 *         - value
 *       properties:
 *         option_id:
 *           description: The ID of the Product Option.
 *           type: string
 *         value:
 *           description: A value to give to the Product Option.
 *           type: string
 */
export class AdminPostProductsProductVariantsReq {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  ean?: string

  @IsString()
  @IsOptional()
  upc?: string

  @IsString()
  @IsOptional()
  barcode?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsNumber()
  @IsOptional()
  inventory_quantity?: number = 0

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean

  @IsBoolean()
  @IsOptional()
  manage_inventory?: boolean = true

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantPricesCreateReq)
  prices: ProductVariantPricesCreateReq[]

  @IsOptional()
  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import {
  PricingService,
  ProductService,
  ProductVariantService,
} from "../../../../services"

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { ProductVariantPricesUpdateReq } from "../../../../types/product-variant"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/products/{id}/variants/{variant_id}
 * operationId: "PostProductsProductVariantsVariant"
 * summary: "Update a Product Variant"
 * description: "Update a Product Variant."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 *   - (path) variant_id=* {string} The ID of the Product Variant.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductVariantsVariantReq"
 * x-codegen:
 *   method: updateVariant
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.updateVariant(product_id, variant_id, {
 *         title: 'Color',
 *         prices: [
 *           {
 *             amount: 1000,
 *             currency_code: "eur"
 *           }
 *         ],
 *         options: [
 *           {
 *             option_id,
 *             value: 'S'
 *           }
 *         ],
 *         inventory_quantity: 100
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products/asfsaf/variants/saaga' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Color",
 *           "prices": [
 *             {
 *               "amount": 1000,
 *               "currency_code": "eur"
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
  const { id, variant_id } = req.params

  const validated = await validator(
    AdminPostProductsProductVariantsVariantReq,
    req.body
  )

  const validatedQueryParams = await validator(PriceSelectionParams, req.query)

  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await productVariantService
      .withTransaction(transactionManager)
      .update(variant_id, {
        product_id: id,
        ...validated,
      })
  })

  const rawProduct = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
    ...validatedQueryParams,
  })

  const [product] = await pricingService.setProductPrices([rawProduct])

  res.json({ product })
}

class ProductVariantOptionReq {
  @IsString()
  value: string

  @IsString()
  option_id: string
}

/**
 * @schema AdminPostProductsProductVariantsVariantReq
 * type: object
 * properties:
 *   title:
 *     description: The title to identify the Product Variant by.
 *     type: string
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
 *   allow_backorder:
 *     description: Whether the Product Variant can be purchased when out of stock.
 *     type: boolean
 *   manage_inventory:
 *     description: Whether Medusa should keep track of the inventory for this Product Variant.
 *     type: boolean
 *   weight:
 *     description: The weight of the Product Variant.
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
 *   prices:
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         id:
 *           description: The ID of the price.
 *           type: string
 *         region_id:
 *           description: The ID of the Region for which the price is used. Only required if currency_code is not provided.
 *           type: string
 *         currency_code:
 *           description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *           type: string
 *           externalDocs:
 *             url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *             description: See a list of codes.
 *         amount:
 *           description: The amount to charge for the Product Variant.
 *           type: integer
 *         min_quantity:
 *          description: The minimum quantity for which the price will be used.
 *          type: integer
 *         max_quantity:
 *           description: The maximum quantity for which the price will be used.
 *           type: integer
 *   options:
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - option_id
 *         - value
 *       properties:
 *         option_id:
 *           description: The ID of the Product Option to set the value for.
 *           type: string
 *         value:
 *           description: The value to give for the Product Option.
 *           type: string
 */
export class AdminPostProductsProductVariantsVariantReq {
  @IsString()
  @IsOptional()
  title?: string

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
  inventory_quantity?: number

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean

  @IsBoolean()
  @IsOptional()
  manage_inventory?: boolean

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
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantPricesUpdateReq)
  prices?: ProductVariantPricesUpdateReq[]

  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

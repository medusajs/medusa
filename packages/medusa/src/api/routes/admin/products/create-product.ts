import {
  IsArray,
  IsBoolean,
  IsEnum,
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
  ProductVariantInventoryService,
  ProductVariantService,
  SalesChannelService,
  ShippingProfileService,
} from "../../../../services"
import {
  ProductProductCategoryReq,
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
} from "../../../../types/product"
import {
  CreateProductVariantInput,
  ProductVariantPricesCreateReq,
} from "../../../../types/product-variant"

import { IInventoryService } from "@medusajs/types"
import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductStatus } from "../../../../models"
import { Logger } from "../../../../types/global"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { FlagRouter } from "../../../../utils/flag-router"
import { DistributedTransaction } from "../../../../utils/transaction"
import { validator } from "../../../../utils/validator"
import {
  createVariantsTransaction,
  revertVariantTransaction,
} from "./transaction/create-product-variant"

/**
 * @oas [post] /admin/products
 * operationId: "PostProducts"
 * summary: "Create a Product"
 * x-authenticated: true
 * description: "Creates a Product"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.create({
 *         title: 'Shirt',
 *         is_giftcard: false,
 *         discountable: true
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Shirt"
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
  const validated = await validator(AdminPostProductsReq, req.body)

  const logger: Logger = req.scope.resolve("logger")
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )

  const entityManager: EntityManager = req.scope.resolve("manager")

  const product = await entityManager.transaction(async (manager) => {
    const { variants } = validated
    delete validated.variants

    if (!validated.thumbnail && validated.images && validated.images.length) {
      validated.thumbnail = validated.images[0]
    }

    let shippingProfile
    // Get default shipping profile
    if (validated.is_giftcard) {
      shippingProfile = await shippingProfileService
        .withTransaction(manager)
        .retrieveGiftCardDefault()
    } else {
      shippingProfile = await shippingProfileService
        .withTransaction(manager)
        .retrieveDefault()
    }

    // Provided that the feature flag is enabled and
    // no sales channels are available, set the default one
    if (
      featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key) &&
      !validated?.sales_channels?.length
    ) {
      const defaultSalesChannel = await salesChannelService
        .withTransaction(manager)
        .retrieveDefault()
      validated.sales_channels = [defaultSalesChannel]
    }

    const newProduct = await productService
      .withTransaction(manager)
      .create({ ...validated, profile_id: shippingProfile.id })

    if (variants) {
      for (const [index, variant] of variants.entries()) {
        variant["variant_rank"] = index
      }

      const optionIds =
        validated?.options?.map(
          (o) => newProduct.options.find((newO) => newO.title === o.title)?.id
        ) || []

      const allVariantTransactions: DistributedTransaction[] = []
      const transactionDependencies = {
        manager,
        inventoryService,
        productVariantInventoryService,
        productVariantService,
      }

      try {
        const variantsInputData = variants.map((variant) => {
          const options =
            variant?.options?.map((option, index) => ({
              ...option,
              option_id: optionIds[index],
            })) || []

          return {
            ...variant,
            options,
          } as CreateProductVariantInput
        })

        const varTransaction = await createVariantsTransaction(
          transactionDependencies,
          newProduct.id,
          variantsInputData
        )
        allVariantTransactions.push(varTransaction)
      } catch (e) {
        await Promise.all(
          allVariantTransactions.map(async (transaction) => {
            await revertVariantTransaction(
              transactionDependencies,
              transaction
            ).catch(() => logger.warn("Transaction couldn't be reverted."))
          })
        )

        throw e
      }
    }

    const rawProduct = await productService
      .withTransaction(manager)
      .retrieve(newProduct.id, {
        select: defaultAdminProductFields,
        relations: defaultAdminProductRelations,
      })

    const [product] = await pricingService
      .withTransaction(manager)
      .setProductPrices([rawProduct])

    return product
  })

  res.json({ product })
}

class ProductVariantOptionReq {
  @IsString()
  value: string
}

class ProductOptionReq {
  @IsString()
  title: string
}

class ProductVariantReq {
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
  @ValidateNested({ each: true })
  @Type(() => ProductVariantPricesCreateReq)
  prices: ProductVariantPricesCreateReq[]

  @IsOptional()
  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

/**
 * @schema AdminPostProductsReq
 * type: object
 * required:
 *   - title
 * properties:
 *   title:
 *     description: "The title of the Product"
 *     type: string
 *   subtitle:
 *     description: "The subtitle of the Product"
 *     type: string
 *   description:
 *     description: "A description of the Product."
 *     type: string
 *   is_giftcard:
 *     description: A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
 *     type: boolean
 *     default: false
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *     type: boolean
 *     default: true
 *   images:
 *     description: Images of the Product.
 *     type: array
 *     items:
 *       type: string
 *   thumbnail:
 *     description: The thumbnail to use for the Product.
 *     type: string
 *   handle:
 *     description: A unique handle to identify the Product by.
 *     type: string
 *   status:
 *     description: The status of the product.
 *     type: string
 *     enum: [draft, proposed, published, rejected]
 *     default: draft
 *   type:
 *     description: The Product Type to associate the Product with.
 *     type: object
 *     required:
 *       - value
 *     properties:
 *       id:
 *         description: The ID of the Product Type.
 *         type: string
 *       value:
 *         description: The value of the Product Type.
 *         type: string
 *   collection_id:
 *     description: The ID of the Collection the Product should belong to.
 *     type: string
 *   tags:
 *     description: Tags to associate the Product with.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         id:
 *           description: The ID of an existing Tag.
 *           type: string
 *         value:
 *           description: The value of the Tag, these will be upserted.
 *           type: string
 *   sales_channels:
 *     description: "[EXPERIMENTAL] Sales channels to associate the Product with."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of an existing Sales channel.
 *           type: string
 *   categories:
 *     description: "Categories to add the Product to."
 *     type: array
 *     items:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a Product Category.
 *           type: string
 *   options:
 *     description: The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           description: The title to identify the Product Option by.
 *           type: string
 *   variants:
 *     description: A list of Product Variants to create with the Product.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           description: The title to identify the Product Variant by.
 *           type: string
 *         sku:
 *           description: The unique SKU for the Product Variant.
 *           type: string
 *         ean:
 *           description: The EAN number of the item.
 *           type: string
 *         upc:
 *           description: The UPC number of the item.
 *           type: string
 *         barcode:
 *           description: A generic GTIN field for the Product Variant.
 *           type: string
 *         hs_code:
 *           description: The Harmonized System code for the Product Variant.
 *           type: string
 *         inventory_quantity:
 *           description: The amount of stock kept for the Product Variant.
 *           type: integer
 *           default: 0
 *         allow_backorder:
 *           description: Whether the Product Variant can be purchased when out of stock.
 *           type: boolean
 *         manage_inventory:
 *           description: Whether Medusa should keep track of the inventory for this Product Variant.
 *           type: boolean
 *         weight:
 *           description: The wieght of the Product Variant.
 *           type: number
 *         length:
 *           description: The length of the Product Variant.
 *           type: number
 *         height:
 *           description: The height of the Product Variant.
 *           type: number
 *         width:
 *           description: The width of the Product Variant.
 *           type: number
 *         origin_country:
 *           description: The country of origin of the Product Variant.
 *           type: string
 *         mid_code:
 *           description: The Manufacturer Identification code for the Product Variant.
 *           type: string
 *         material:
 *           description: The material composition of the Product Variant.
 *           type: string
 *         metadata:
 *           description: An optional set of key-value pairs with additional information.
 *           type: object
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               region_id:
 *                 description: The ID of the Region for which the price is used. Only required if currency_code is not provided.
 *                 type: string
 *               currency_code:
 *                 description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *                 type: string
 *                 externalDocs:
 *                   url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                   description: See a list of codes.
 *               amount:
 *                 description: The amount to charge for the Product Variant.
 *                 type: integer
 *               min_quantity:
 *                 description: The minimum quantity for which the price will be used.
 *                 type: integer
 *               max_quantity:
 *                 description: The maximum quantity for which the price will be used.
 *                 type: integer
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                 type: string
 *   weight:
 *     description: The weight of the Product.
 *     type: number
 *   length:
 *     description: The length of the Product.
 *     type: number
 *   height:
 *     description: The height of the Product.
 *     type: number
 *   width:
 *     description: The width of the Product.
 *     type: number
 *   hs_code:
 *     description: The Harmonized System code for the Product Variant.
 *     type: string
 *   origin_country:
 *     description: The country of origin of the Product.
 *     type: string
 *   mid_code:
 *     description: The Manufacturer Identification code for the Product.
 *     type: string
 *   material:
 *     description: The material composition of the Product.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
export class AdminPostProductsReq {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  is_giftcard = false

  @IsBoolean()
  discountable = true

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT

  @IsOptional()
  @Type(() => ProductTypeReq)
  @ValidateNested()
  type?: ProductTypeReq

  @IsOptional()
  @IsString()
  collection_id?: string

  @IsOptional()
  @Type(() => ProductTagReq)
  @ValidateNested({ each: true })
  @IsArray()
  tags?: ProductTagReq[]

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
    IsOptional(),
    Type(() => ProductSalesChannelReq),
    ValidateNested({ each: true }),
    IsArray(),
  ])
  sales_channels?: ProductSalesChannelReq[]

  @IsOptional()
  @Type(() => ProductProductCategoryReq)
  @ValidateNested({ each: true })
  @IsArray()
  categories?: ProductProductCategoryReq[]

  @IsOptional()
  @Type(() => ProductOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductOptionReq[]

  @IsOptional()
  @Type(() => ProductVariantReq)
  @ValidateNested({ each: true })
  @IsArray()
  variants?: ProductVariantReq[]

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
  hs_code?: string

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

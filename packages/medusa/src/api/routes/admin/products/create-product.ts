import { Workflows, createProducts } from "@medusajs/core-flows"
import { IInventoryService, WorkflowTypes } from "@medusajs/types"
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
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
  defaultAdminProductRemoteQueryObject,
} from "."
import { featureFlagRouter } from "../../../../loaders/feature-flags"
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
import {
  createVariantsTransaction,
  revertVariantTransaction,
} from "./transaction/create-product-variant"

import { DistributedTransaction } from "@medusajs/orchestration"
import { FlagRouter, MedusaV2Flag, promiseAll } from "@medusajs/utils"
import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductStatus } from "../../../../models"
import { Logger } from "../../../../types/global"
import { retrieveProduct, validator } from "../../../../utils"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"

/**
 * @oas [post] /admin/products
 * operationId: "PostProducts"
 * summary: "Create a Product"
 * x-authenticated: true
 * description: "Create a new Product. This API Route can also be used to create a gift card if the `is_giftcard` field is set to `true`."
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
 *         title: "Shirt",
 *         is_giftcard: false,
 *         discountable: true
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCreateProduct } from "medusa-react"
 *
 *       type CreateProductData = {
 *         title: string
 *         is_giftcard: boolean
 *         discountable: boolean
 *         options: {
 *           title: string
 *         }[]
 *         variants: {
 *           title: string
 *           prices: {
 *             amount: number
 *             currency_code :string
 *           }[]
 *           options: {
 *             value: string
 *           }[]
 *         }[],
 *         collection_id: string
 *         categories: {
 *           id: string
 *         }[]
 *         type: {
 *           value: string
 *         }
 *         tags: {
 *           value: string
 *         }[]
 *       }
 *
 *       const CreateProduct = () => {
 *         const createProduct = useAdminCreateProduct()
 *         // ...
 *
 *         const handleCreate = (productData: CreateProductData) => {
 *           createProduct.mutate(productData, {
 *             onSuccess: ({ product }) => {
 *               console.log(product.id)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default CreateProduct
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/products' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Shirt"
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
  const productModuleService = req.scope.resolve("productModuleService")
  const isMedusaV2Enabled = featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)

  if (isMedusaV2Enabled && !productModuleService) {
    logger.warn(
      `Cannot run ${Workflows.CreateProducts} workflow without '@medusajs/product' installed`
    )
  }

  let product

  if (isMedusaV2Enabled && !!productModuleService) {
    const createProductWorkflow = createProducts(req.scope)

    const input = {
      products: [
        validated,
      ] as WorkflowTypes.ProductWorkflow.CreateProductInputDTO[],
    }

    const { result } = await createProductWorkflow.run({
      input,
      context: {
        manager: entityManager,
      },
    })
    product = result[0]
  } else {
    product = await entityManager.transaction(async (manager) => {
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
          await promiseAll(
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

      return newProduct
    })
  }

  let rawProduct
  if (isMedusaV2Enabled) {
    rawProduct = await retrieveProduct(
      req.scope,
      product.id,
      defaultAdminProductRemoteQueryObject
    )
  } else {
    rawProduct = await productService.retrieve(product.id, {
      select: defaultAdminProductFields,
      relations: defaultAdminProductRelations,
    })
  }

  const [pricedProduct] = await pricingService.setAdminProductPricing([
    rawProduct,
  ])

  res.json({ product: pricedProduct })
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
 * description: "The details of the product to create."
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
 *     description: "The description of the Product."
 *     type: string
 *   is_giftcard:
 *     description: A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
 *     type: boolean
 *     default: false
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the Line Items generated from this Product
 *     type: boolean
 *     default: true
 *   images:
 *     description: An array of images of the Product. Each value in the array is a URL to the image. You can use the upload API Routes to upload the image and obtain a URL.
 *     type: array
 *     items:
 *       type: string
 *   thumbnail:
 *     description: The thumbnail to use for the Product. The value is a URL to the thumbnail. You can use the upload API Routes to upload the thumbnail and obtain a URL.
 *     type: string
 *   handle:
 *     description: A unique handle to identify the Product by. If not provided, the kebab-case version of the product title will be used. This can be used as a slug in URLs.
 *     type: string
 *   status:
 *     description: The status of the product. The product is shown to the customer only if its status is `published`.
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
 *         description: The ID of an existing Product Type. If not provided, a new product type will be created.
 *         type: string
 *       value:
 *         description: The value of the Product Type.
 *         type: string
 *   collection_id:
 *     description: The ID of the Product Collection the Product belongs to.
 *     type: string
 *   tags:
 *     description: Product Tags to associate the Product with.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         id:
 *           description: The ID of an existing Product Tag. If not provided, a new product tag will be created.
 *           type: string
 *         value:
 *           description: The value of the Tag. If the `id` is provided, the value of the existing tag will be updated.
 *           type: string
 *   sales_channels:
 *     description: "Sales channels to associate the Product with."
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
 *     description: "Product categories to add the Product to."
 *     x-featureFlag: "product_categories"
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a Product Category.
 *           type: string
 *   options:
 *     description: The Options that the Product should have. A new product option will be created for every item in the array.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           description: The title of the Product Option.
 *           type: string
 *   variants:
 *     description: An array of Product Variants to create with the Product. Each product variant must have a unique combination of Product Option values.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           description: The title of the Product Variant.
 *           type: string
 *         sku:
 *           description: The unique SKU of the Product Variant.
 *           type: string
 *         ean:
 *           description: The EAN number of the item.
 *           type: string
 *         upc:
 *           description: The UPC number of the item.
 *           type: string
 *         barcode:
 *           description: A generic GTIN field of the Product Variant.
 *           type: string
 *         hs_code:
 *           description: The Harmonized System code of the Product Variant.
 *           type: string
 *         inventory_quantity:
 *           description: The amount of stock kept of the Product Variant.
 *           type: integer
 *           default: 0
 *         allow_backorder:
 *           description: Whether the Product Variant can be purchased when out of stock.
 *           type: boolean
 *         manage_inventory:
 *           description: Whether Medusa should keep track of the inventory of this Product Variant.
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
 *           description: The Manufacturer Identification code of the Product Variant.
 *           type: string
 *         material:
 *           description: The material composition of the Product Variant.
 *           type: string
 *         metadata:
 *           description: An optional set of key-value pairs with additional information.
 *           type: object
 *           externalDocs:
 *             description: "Learn about the metadata attribute, and how to delete and update it."
 *             url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 *         prices:
 *           type: array
 *           description: An array of product variant prices. A product variant can have different prices for each region or currency code.
 *           externalDocs:
 *             url: https://docs.medusajs.com/modules/products/admin/manage-products#product-variant-prices
 *             description: Product variant pricing.
 *           items:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               region_id:
 *                 description: The ID of the Region the price will be used in. This is only required if `currency_code` is not provided.
 *                 type: string
 *               currency_code:
 *                 description: The 3 character ISO currency code the price will be used in. This is only required if `region_id` is not provided.
 *                 type: string
 *                 externalDocs:
 *                   url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                   description: See a list of codes.
 *               amount:
 *                 description: The price amount.
 *                 type: integer
 *               min_quantity:
 *                 description: The minimum quantity required to be added to the cart for the price to be used.
 *                 type: integer
 *               max_quantity:
 *                 description: The maximum quantity required to be added to the cart for the price to be used.
 *                 type: integer
 *         options:
 *           type: array
 *           description: An array of Product Option values that the variant corresponds to. The option values should be added into the array in the same index as in the `options` field of the product.
 *           externalDocs:
 *             url: https://docs.medusajs.com/modules/products/admin/manage-products#create-a-product
 *             description: Example of how to create a product with options and variants
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
 *     description: The Harmonized System code of the Product.
 *     type: string
 *   origin_country:
 *     description: The country of origin of the Product.
 *     type: string
 *   mid_code:
 *     description: The Manufacturer Identification code of the Product.
 *     type: string
 *   material:
 *     description: The material composition of the Product.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
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

  constructor() {
    if (!featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
      delete this.sales_channels
    }
  }
}

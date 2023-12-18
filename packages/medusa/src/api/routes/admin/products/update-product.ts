import { Workflows, updateProducts } from "@medusajs/core-flows"
import { DistributedTransaction } from "@medusajs/orchestration"
import {
  FlagRouter,
  MedusaError,
  MedusaV2Flag,
  promiseAll,
} from "@medusajs/utils"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { EntityManager } from "typeorm"

import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
  defaultAdminProductRemoteQueryObject,
} from "."
import { ProductStatus, ProductVariant } from "../../../../models"
import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import {
  ProductProductCategoryReq,
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
} from "../../../../types/product"
import {
  CreateProductVariantInput,
  ProductVariantPricesUpdateReq,
  UpdateProductVariantInput,
} from "../../../../types/product-variant"
import { retrieveProduct } from "../../../../utils"
import {
  createVariantsTransaction,
  revertVariantTransaction,
} from "./transaction/create-product-variant"

import { IInventoryService, WorkflowTypes } from "@medusajs/types"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductVariantRepository } from "../../../../repositories/product-variant"
import { Logger } from "../../../../types/global"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"

import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/products/{id}
 * operationId: "PostProductsProduct"
 * summary: "Update a Product"
 * description: "Update a Product's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.update(productId, {
 *         title: "Shirt",
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/products/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Size"
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

  const validated = await validator(AdminPostProductsProductReq, req.body)

  const logger: Logger = req.scope.resolve("logger")
  const productVariantRepo: typeof ProductVariantRepository = req.scope.resolve(
    "productVariantRepository"
  )
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  const productModuleService = req.scope.resolve("productModuleService")

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const isMedusaV2Enabled = featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)

  if (isMedusaV2Enabled && !productModuleService) {
    logger.warn(
      `Cannot run ${Workflows.UpdateProducts} workflow without '@medusajs/product' installed`
    )
  }

  if (isMedusaV2Enabled) {
    const updateProductWorkflow = updateProducts(req.scope)

    const input = {
      products: [
        { id, ...validated },
      ] as WorkflowTypes.ProductWorkflow.UpdateProductInputDTO[],
    }

    const { result } = await updateProductWorkflow.run({
      input,
      context: {
        manager: manager,
      },
    })
  } else {
    await manager.transaction(async (transactionManager) => {
      const productServiceTx =
        productService.withTransaction(transactionManager)

      const { variants } = validated
      delete validated.variants

      const product = await productServiceTx.update(id, validated)

      if (!variants) {
        return
      }

      const variantRepo = manager.withRepository(productVariantRepo)
      const productVariants = await productVariantService
        .withTransaction(transactionManager)
        .list(
          { product_id: id },
          {
            select: variantRepo.metadata.columns.map(
              (c) => c.propertyName
            ) as (keyof ProductVariant)[],
          }
        )

      const productVariantMap = new Map(productVariants.map((v) => [v.id, v]))
      const variantWithIdSet = new Set()

      const variantIdsNotBelongingToProduct: string[] = []
      const variantsToUpdate: {
        variant: ProductVariant
        updateData: UpdateProductVariantInput
      }[] = []
      const variantsToCreate: ProductVariantReq[] = []

      // Preparing the data step
      for (const [variantRank, variant] of variants.entries()) {
        if (!variant.id) {
          Object.assign(variant, {
            variant_rank: variantRank,
            options: variant.options || [],
            prices: variant.prices || [],
          })
          variantsToCreate.push(variant)

          continue
        }

        // Will be used to find the variants that should be removed during the next steps
        variantWithIdSet.add(variant.id)

        if (!productVariantMap.has(variant.id)) {
          variantIdsNotBelongingToProduct.push(variant.id)
          continue
        }

        const productVariant = productVariantMap.get(variant.id)!
        Object.assign(variant, {
          variant_rank: variantRank,
          product_id: productVariant.product_id,
        })
        variantsToUpdate.push({ variant: productVariant, updateData: variant })
      }

      if (variantIdsNotBelongingToProduct.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Variants with id: ${variantIdsNotBelongingToProduct.join(
            ", "
          )} are not associated with this product`
        )
      }

      const allVariantTransactions: DistributedTransaction[] = []
      const transactionDependencies = {
        manager: transactionManager,
        inventoryService,
        productVariantInventoryService,
        productVariantService,
      }

      const productVariantServiceTx =
        productVariantService.withTransaction(transactionManager)

      // Delete the variant that does not exist anymore from the provided variants
      const variantIdsToDelete = [...productVariantMap.keys()].filter(
        (variantId) => !variantWithIdSet.has(variantId)
      )

      if (variantIdsToDelete) {
        await productVariantServiceTx.delete(variantIdsToDelete)
      }

      if (variantsToUpdate.length) {
        await productVariantServiceTx.update(variantsToUpdate)
      }

      if (variantsToCreate.length) {
        try {
          const varTransaction = await createVariantsTransaction(
            transactionDependencies,
            product.id,
            variantsToCreate as CreateProductVariantInput[]
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
    })
  }

  let rawProduct

  if (isMedusaV2Enabled) {
    rawProduct = await retrieveProduct(
      req.scope,
      id,
      defaultAdminProductRemoteQueryObject
    )
  } else {
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

class ProductVariantReq {
  @IsString()
  @IsOptional()
  id?: string

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

  @IsInt()
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

  @IsOptional()
  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

/**
 * @schema AdminPostProductsProductReq
 * type: object
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
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the Line Items generated from this Product
 *     type: boolean
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
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a Product Category.
 *           type: string
 *   variants:
 *     description: An array of Product Variants to create with the Product. Each product variant must have a unique combination of Product Option values.
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         id:
 *           description: The id of an existing product variant. If provided, the details of the product variant will be updated. If not, a new product variant will be created.
 *           type: string
 *         title:
 *           description: The title of the product variant.
 *           type: string
 *         sku:
 *           description: The unique SKU of the product variant.
 *           type: string
 *         ean:
 *           description: The EAN number of the product variant.
 *           type: string
 *         upc:
 *           description: The UPC number of the product variant.
 *           type: string
 *         barcode:
 *           description: A generic GTIN field of the product variant.
 *           type: string
 *         hs_code:
 *           description: The Harmonized System code of the product variant.
 *           type: string
 *         inventory_quantity:
 *           description: The amount of stock kept of the product variant.
 *           type: integer
 *         allow_backorder:
 *           description: Whether the product variant can be purchased when out of stock.
 *           type: boolean
 *         manage_inventory:
 *           description: Whether Medusa should keep track of the inventory of this product variant.
 *           type: boolean
 *         weight:
 *           description: The weight of the product variant.
 *           type: number
 *         length:
 *           description: The length of the product variant.
 *           type: number
 *         height:
 *           description: The height of the product variant.
 *           type: number
 *         width:
 *           description: The width of the product variant.
 *           type: number
 *         origin_country:
 *           description: The country of origin of the product variant.
 *           type: string
 *         mid_code:
 *           description: The Manufacturer Identification code of the product variant.
 *           type: string
 *         material:
 *           description: The material composition of the product variant.
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
 *               id:
 *                 description: The ID of the Price. If provided, the existing price will be updated. Otherwise, a new price will be created.
 *                 type: string
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
 *           description: An array of Product Option values that the variant corresponds to.
 *           items:
 *             type: object
 *             required:
 *               - option_id
 *               - value
 *             properties:
 *               option_id:
 *                 description: The ID of the Option.
 *                 type: string
 *               value:
 *                 description: The value of the Product Option.
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
 *     description: The Harmonized System code of the product variant.
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
export class AdminPostProductsProductReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  discountable?: boolean

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsEnum(ProductStatus)
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  status?: ProductStatus

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
  sales_channels?: ProductSalesChannelReq[] | null

  @IsOptional()
  @Type(() => ProductProductCategoryReq)
  @ValidateNested({ each: true })
  @IsArray()
  categories?: ProductProductCategoryReq[]

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

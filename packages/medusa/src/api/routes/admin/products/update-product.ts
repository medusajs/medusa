import { IInventoryService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
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
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductStatus, ProductVariant } from "../../../../models"
import { ProductVariantRepository } from "../../../../repositories/product-variant"
import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import { Logger } from "../../../../types/global"
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
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { DistributedTransaction } from "../../../../utils/transaction"
import { validator } from "../../../../utils/validator"
import {
  createVariantsTransaction,
  revertVariantTransaction,
} from "./transaction/create-product-variant"

/**
 * @oas [post] /admin/products/{id}
 * operationId: "PostProductsProduct"
 * summary: "Update a Product"
 * description: "Updates a Product"
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
 *       medusa.admin.products.update(product_id, {
 *         title: 'Shirt',
 *         images: []
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Size"
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
  await manager.transaction(async (transactionManager) => {
    const productServiceTx = productService.withTransaction(transactionManager)

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
  })

  const rawProduct = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
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
 *     description: "A description of the Product."
 *     type: string
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *     type: boolean
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
 *   variants:
 *     description: A list of Product Variants to create with the Product.
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         id:
 *           description: The ID of the Product Variant.
 *           type: string
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
 *               id:
 *                 description: The ID of the Price.
 *                 type: string
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
 *               - option_id
 *               - value
 *             properties:
 *               option_id:
 *                 description: The ID of the Option.
 *                 type: string
 *               value:
 *                 description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                 type: string
 *   weight:
 *     description: The wieght of the Product.
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

import { Type } from "class-transformer"
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
import { EntityManager } from "typeorm"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductStatus } from "../../../../models"
import {
  PricingService,
  ProductService,
  ProductVariantService,
  ShippingProfileService,
} from "../../../../services"
import {
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
} from "../../../../types/product"
import { ProductVariantPricesCreateReq } from "../../../../types/product-variant"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /products
 * operationId: "PostProducts"
 * summary: "Create a Product"
 * x-authenticated: true
 * description: "Creates a Product"
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - title
 *         - subtitle
 *         - description
 *       schema:
 *         required:
 *           - title
 *         properties:
 *           title:
 *             description: "The title of the Product"
 *             type: string
 *           subtitle:
 *             description: "The subtitle of the Product"
 *             type: string
 *           description:
 *             description: "A description of the Product."
 *             type: string
 *           is_giftcard:
 *             description: A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
 *             type: boolean
 *           discountable:
 *             description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *             type: boolean
 *           images:
 *             description: Images of the Product.
 *             type: array
 *             items:
 *               type: string
 *           thumbnail:
 *             description: The thumbnail to use for the Product.
 *             type: string
 *           handle:
 *             description: A unique handle to identify the Product by.
 *             type: string
 *           type:
 *             description: The Product Type to associate the Product with.
 *             type: object
 *             properties:
 *               value:
 *                 description: The value of the Product Type.
 *                 type: string
 *           collection_id:
 *             description: The id of the Collection the Product should belong to.
 *             type: string
 *           tags:
 *             description: Tags to associate the Product with.
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: The id of an existing Tag.
 *                   type: string
 *                 value:
 *                   description: The value of the Tag, these will be upserted.
 *                   type: string
 *          sales_channels:
 *             description: [EXPERIMENTAL] Sales channels to associate the Product with.
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: The id of an existing Sales channel.
 *                   type: string
 *           options:
 *             description: The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
 *             type: array
 *             items:
 *               properties:
 *                 title:
 *                   description: The title to identify the Product Option by.
 *                   type: string
 *           variants:
 *             description: A list of Product Variants to create with the Product.
 *             type: array
 *             items:
 *               properties:
 *                 title:
 *                   description: The title to identify the Product Variant by.
 *                   type: string
 *                 sku:
 *                   description: The unique SKU for the Product Variant.
 *                   type: string
 *                 ean:
 *                   description: The EAN number of the item.
 *                   type: string
 *                 upc:
 *                   description: The UPC number of the item.
 *                   type: string
 *                 barcode:
 *                   description: A generic GTIN field for the Product Variant.
 *                   type: string
 *                 hs_code:
 *                   description: The Harmonized System code for the Product Variant.
 *                   type: string
 *                 inventory_quantity:
 *                   description: The amount of stock kept for the Product Variant.
 *                   type: integer
 *                 allow_backorder:
 *                   description: Whether the Product Variant can be purchased when out of stock.
 *                   type: boolean
 *                 manage_inventory:
 *                   description: Whether Medusa should keep track of the inventory for this Product Variant.
 *                   type: boolean
 *                 weight:
 *                   description: The wieght of the Product Variant.
 *                   type: string
 *                 length:
 *                   description: The length of the Product Variant.
 *                   type: string
 *                 height:
 *                   description: The height of the Product Variant.
 *                   type: string
 *                 width:
 *                   description: The width of the Product Variant.
 *                   type: string
 *                 origin_country:
 *                   description: The country of origin of the Product Variant.
 *                   type: string
 *                 mid_code:
 *                   description: The Manufacturer Identification code for the Product Variant.
 *                   type: string
 *                 material:
 *                   description: The material composition of the Product Variant.
 *                   type: string
 *                 metadata:
 *                   description: An optional set of key-value pairs with additional information.
 *                   type: object
 *                 prices:
 *                   type: array
 *                   items:
 *                     properties:
 *                       region_id:
 *                         description: The id of the Region for which the price is used.
 *                         type: string
 *                       currency_code:
 *                         description: The 3 character ISO currency code for which the price will be used.
 *                         type: string
 *                       amount:
 *                         description: The amount to charge for the Product Variant.
 *                         type: integer
 *                       sale_amount:
 *                         description: The sale amount to charge for the Product Variant.
 *                         type: integer
 *                 options:
 *                   type: array
 *                   items:
 *                     properties:
 *                       value:
 *                         description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                         type: string
 *           weight:
 *             description: The wieght of the Product.
 *             type: string
 *           length:
 *             description: The length of the Product.
 *             type: string
 *           height:
 *             description: The height of the Product.
 *             type: string
 *           width:
 *             description: The width of the Product.
 *             type: string
 *           origin_country:
 *             description: The country of origin of the Product.
 *             type: string
 *           mid_code:
 *             description: The Manufacturer Identification code for the Product.
 *             type: string
 *           material:
 *             description: The material composition of the Product.
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const validated = await validator(AdminPostProductsReq, req.body)

  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const shippingProfileService: ShippingProfileService = req.scope.resolve(
    "shippingProfileService"
  )

  const entityManager: EntityManager = req.scope.resolve("manager")

  let newProduct
  await entityManager.transaction(async (manager) => {
    const { variants } = validated
    delete validated.variants

    if (!validated.thumbnail && validated.images && validated.images.length) {
      validated.thumbnail = validated.images[0]
    }

    let shippingProfile
    // Get default shipping profile
    if (validated.is_giftcard) {
      shippingProfile = await shippingProfileService.retrieveGiftCardDefault()
    } else {
      shippingProfile = await shippingProfileService.retrieveDefault()
    }

    newProduct = await productService
      .withTransaction(manager)
      .create({ ...validated, profile_id: shippingProfile.id })

    if (variants) {
      for (const [i, variant] of variants.entries()) {
        variant["variant_rank"] = i
      }

      const optionIds =
        validated?.options?.map(
          (o) => newProduct.options.find((newO) => newO.title === o.title).id
        ) || []

      await Promise.all(
        variants.map(async (v) => {
          const variant = {
            ...v,
            options:
              v?.options?.map((o, index) => ({
                ...o,
                option_id: optionIds[index],
              })) || [],
          }

          await productVariantService
            .withTransaction(manager)
            .create(newProduct.id, variant)
        })
      )
    }
  })

  const rawProduct = await productService.retrieve(newProduct.id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  const [product] = await pricingService.setProductPrices([rawProduct])

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
  inventory_quantity = 0

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

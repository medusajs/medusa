import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  CartService,
  ProductService,
  ProductVariantInventoryService,
} from "../../../../services"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import PricingService from "../../../../services/pricing"
import { DateComparisonOperator } from "../../../../types/common"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"
import { IsType } from "../../../../utils/validators/is-type"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { Cart, Product } from "../../../../models"
import { defaultStoreCategoryScope } from "../product-categories"

/**
 * @oas [get] /store/products
 * operationId: GetProducts
 * summary: List Products
 * description: "Retrieves a list of Products."
 * parameters:
 *   - (query) q {string} Query used for searching products by title, description, variant's title, variant's sku, and collection's title
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: product IDs to search for.
 *     schema:
 *       oneOf:
 *         - type: string
 *         - type: array
 *           items:
 *             type: string
 *   - in: query
 *     name: sales_channel_id
 *     style: form
 *     explode: false
 *     description: an array of sales channel IDs to filter the retrieved products by.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: collection_id
 *     style: form
 *     explode: false
 *     description: Collection IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: type_id
 *     style: form
 *     explode: false
 *     description: Type IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: tags
 *     style: form
 *     explode: false
 *     description: Tag IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) title {string} title to search for.
 *   - (query) description {string} description to search for.
 *   - (query) handle {string} handle to search for.
 *   - (query) is_giftcard {boolean} Search for giftcards using is_giftcard=true.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting products were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting products were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: category_id
 *     style: form
 *     explode: false
 *     description: Category ids to filter by.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) include_category_children {boolean} Include category children when filtering by category_id.
 *   - (query) offset=0 {integer} How many products to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of products returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 *   - (query) order {string} the field used to order the products.
 *   - (query) cart_id {string} The id of the Cart to set prices based on.
 *   - (query) region_id {string} The id of the Region to set prices based on.
 *   - (query) currency_code {string} The currency code to use for price selection.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.products.list()
 *       .then(({ products, limit, offset, count }) => {
 *         console.log(products.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/products'
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const productService: ProductService = req.scope.resolve("productService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")

  const validated = req.validatedQuery as StoreGetProductsParams

  let {
    cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    ...filterableFields
  } = req.filterableFields

  const listConfig = req.listConfig

  // get only published products for store endpoint
  filterableFields["status"] = ["published"]
  // store APIs only receive active and public categories to query from
  filterableFields["categories"] = {
    ...(filterableFields.categories || {}),
    // Store APIs are only allowed to query active and public categories
    ...defaultStoreCategoryScope
  }

  if (req.publishableApiKeyScopes?.sales_channel_ids.length) {
    filterableFields.sales_channel_id =
      filterableFields.sales_channel_id ||
      req.publishableApiKeyScopes.sales_channel_ids

    if (!listConfig.relations.includes("listConfig.relations")) {
      listConfig.relations.push("sales_channels")
    }
  }

  const promises: Promise<any>[] = []

  promises.push(productService.listAndCount(filterableFields, listConfig))

  if (validated.cart_id) {
    promises.push(
      cartService.retrieve(validated.cart_id, {
        select: ["id", "region_id"] as any,
        relations: ["region"],
      })
    )
  }

  const [[rawProducts, count], cart] = (await Promise.all(promises)) as [
    [Product[], number],
    Cart
  ]

  if (validated.cart_id) {
    regionId = cart.region_id
    currencyCode = cart.region.currency_code
  }

  // Create a new reference just for naming purpose
  const computedProducts = rawProducts

  // We can run them concurrently as the new properties are assigned to the references
  // of the appropriate entity
  await Promise.all([
    pricingService.setProductPrices(computedProducts, {
      cart_id: cart_id,
      region_id: regionId,
      currency_code: currencyCode,
      customer_id: req.user?.customer_id,
      include_discount_prices: true,
    }),
    productVariantInventoryService.setProductAvailability(
      computedProducts,
      filterableFields.sales_channel_id
    ),
  ])

  res.json({
    products: cleanResponseData(computedProducts, req.allowedProperties || []),
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class StoreGetProductsPaginationParams extends PriceSelectionParams {
  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100

  @IsString()
  @IsOptional()
  order?: string
}

export class StoreGetProductsParams extends StoreGetProductsPaginationParams {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  q?: string

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  is_giftcard?: boolean

  @IsArray()
  @IsOptional()
  type_id?: string[]

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [IsOptional(), IsArray()])
  sales_channel_id?: string[]

  @IsArray()
  @IsOptional()
  category_id?: string[]

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  include_category_children?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

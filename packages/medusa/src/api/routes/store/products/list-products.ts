import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { omit, pickBy } from "lodash"
import { defaultStoreProductsRelations } from "."
import {
  ProductService,
  RegionService,
  CartService,
} from "../../../../services"
import PricingService from "../../../../services/pricing"
import { DateComparisonOperator } from "../../../../types/common"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { validator } from "../../../../utils/validator"
import { IsType } from "../../../../utils/validators/is-type"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /products
 * operationId: GetProducts
 * summary: List Products
 * description: "Retrieves a list of Products."
 * parameters:
 *   - (query) q {string} Query used for searching products.
 *   - (query) id {string} Id of the product to search for.
 *   - (query) collection_id {string[]} Collection ids to search for.
 *   - (query) tags {string[]} Tags to search for.
 *   - (query) title {string} to search for.
 *   - (query) description {string} to search for.
 *   - (query) handle {string} to search for.
 *   - (query) is_giftcard {string} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} to search for.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting products was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting products was updated, i.e. less than, greater than etc.
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting products was deleted, i.e. less than, greater than etc.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Products.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Products to return,
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")

  const validated = await validator(StoreGetProductsParams, req.query)

  const filterableFields: StoreGetProductsParams = omit(validated, [
    "fields",
    "expand",
    "limit",
    "offset",
    "cart_id",
    "region_id",
    "currency_code",
  ])

  // get only published products for store endpoint
  filterableFields["status"] = ["published"]

  let includeFields: string[] = []
  if (validated.fields) {
    const set = new Set(validated.fields.split(","))
    set.add("id")
    includeFields = [...set]
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const listConfig = {
    select: includeFields.length ? includeFields : undefined,
    relations: expandFields.length
      ? expandFields
      : defaultStoreProductsRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const [rawProducts, count] = await productService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  let regionId = validated.region_id
  let currencyCode = validated.currency_code
  if (validated.cart_id) {
    const cart = await cartService.retrieve(validated.cart_id, {
      select: ["id", "region_id"],
    })
    const region = await regionService.retrieve(cart.region_id, {
      select: ["id", "currency_code"],
    })
    regionId = region.id
    currencyCode = region.currency_code
  }

  const products = await pricingService.setProductPrices(rawProducts, {
    cart_id: validated.cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    customer_id: req.user?.customer_id,
    include_discount_prices: true,
  })

  res.json({
    products,
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

  @IsString()
  @IsOptional()
  type?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

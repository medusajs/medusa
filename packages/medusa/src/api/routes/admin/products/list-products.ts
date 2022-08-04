import { IsNumber, IsOptional, IsString } from "class-validator"
import { PricingService, ProductService } from "../../../../services"

import { FilterableProductProps } from "../../../../types/product"
import { PricedProduct } from "../../../../types/pricing"
import { Product } from "../../../../models"
import { Type } from "class-transformer"

/**
 * @oas [get] /products
 * operationId: "GetProducts"
 * summary: "List Product"
 * description: "Retrieves a list of Product"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching product title and description, variant title and sku, and collection title.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by product IDs.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: ID of the product to search for.
 *         - type: array
 *           items:
 *             type: string
 *             description: ID of a product.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Status to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [draft, proposed, published, rejected]
 *   - in: query
 *     name: collection_id
 *     style: form
 *     explode: false
 *     description: Collection ids to search for.
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
 *   - in: query
 *     name: price_list_id
 *     style: form
 *     explode: false
 *     description: Price List IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: sales_channel_id
 *     style: form
 *     explode: false
 *     description: Sales Channel IDs to filter products by
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) title {string} title to search for.
 *   - (query) description {string} description to search for.
 *   - (query) handle {string} handle to search for.
 *   - (query) is_giftcard {boolean} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} type ID to search for.
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
 *     name: deleted_at
 *     description: Date comparison for when resulting products were deleted.
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
 *   - (query) offset=0 {integer} How many products to skip in the result.
 *   - (query) limit=50 {integer} Limit the number of products returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each product of the result.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const { skip, take, relations } = req.listConfig

  const [rawProducts, count] = await productService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  let products: (Product | PricedProduct)[] = rawProducts

  const includesPricing = ["variants", "variants.prices"].every((relation) =>
    relations?.includes(relation)
  )
  if (includesPricing) {
    products = await pricingService.setProductPrices(rawProducts)
  }

  res.json({
    products,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetProductsParams extends FilterableProductProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}

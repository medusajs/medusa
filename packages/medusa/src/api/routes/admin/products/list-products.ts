import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Product } from "../../../../models"
import { PricedProduct } from "../../../../types/pricing"
import { PricingService, ProductService } from "../../../../services"
import { FilterableProductProps } from "../../../../types/product"

/**
 * @oas [get] /products
 * operationId: "GetProducts"
 * summary: "List Product"
 * description: "Retrieves a list of Product"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching products.
 *   - (query) id {string} Id of the product to search for.
 *   - (query) status {string[]} Status to search for.
 *   - (query) collection_id {string[]} Collection ids to search for.
 *   - (query) tags {string[]} Tags to search for.
 *   - (query) title {string} to search for.
 *   - (query) description {string} to search for.
 *   - (query) handle {string} to search for.
 *   - (query) is_giftcard {string} Search for giftcards using is_giftcard=true.
 *   - (query) type {string} to search for.
 *   - (query) order {string} to retrieve products in.
 *   - (query) sales_chanel_id {string[]} to retrieve products in.
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting products was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting products was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting products was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
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
 *             count:
 *               description: The number of Products.
 *               type: integer
 *             offset:
 *               description: The offset of the Product query.
 *               type: integer
 *             limit:
 *               description: The limit of the Product query.
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
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

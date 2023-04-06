import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  SalesChannelService,
} from "../../../../services"

import { FilterableProductProps } from "../../../../types/product"
import { PricedProduct } from "../../../../types/pricing"
import { Product } from "../../../../models"
import { Type } from "class-transformer"
import { IInventoryService } from "@medusajs/types"

/**
 * @oas [get] /admin/products
 * operationId: "GetProducts"
 * summary: "List Products"
 * description: "Retrieves a list of Product"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching product title and description, variant title and sku, and collection title.
 *   - (query) discount_condition_id {string} The discount condition id on which to filter the product.
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
 *   - in: query
 *     name: type_id
 *     style: form
 *     explode: false
 *     description: Type IDs to filter products by
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: category_id
 *     style: form
 *     explode: false
 *     description: Category IDs to filter products by
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) include_category_children {boolean} Include category children when filtering by category_id
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
 *   - (query) order {string} the field used to order the products.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetProductsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.list()
 *       .then(({ products, limit, offset, count }) => {
 *         console.log(products.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/products' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *           $ref: "#/components/schemas/AdminProductsListRes"
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
  const productService: ProductService = req.scope.resolve("productService")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
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

  if (inventoryService) {
    const [salesChannelsIds] = await salesChannelService.listAndCount(
      {},
      { select: ["id"] }
    )

    products = await productVariantInventoryService.setProductAvailability(
      products,
      salesChannelsIds.map((salesChannel) => salesChannel.id)
    )
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

  @IsString()
  @IsOptional()
  order?: string
}

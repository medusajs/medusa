import { Request, Response } from "express"
import { IsString, IsOptional } from "class-validator"

import { ProductCategoryService } from "../../../../services"
import { GetProductCategoriesParams } from "../../../../types/product-category"

/**
 * @oas [get] /admin/product-categories
 * operationId: "GetProductCategories"
 * summary: "List Product Categories"
 * description: "Retrieve a list of product categories."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching product category names or handles.
 *   - (query) handle {string} Query used for searching product category by handle.
 *   - (query) is_internal {boolean} Search for only internal categories.
 *   - (query) is_active {boolean} Search for only active categories
 *   - (query) include_descendants_tree {boolean} Include all nested descendants of category
 *   - (query) descendants_depth {number} Descendants categories at retreived upto a certain depth. descendants_depth is a number greater than 0.
 *   - in: query
 *     name: depth
 *     style: form
 *     explode: false
 *     description: Query categories at a certain depth. depth is an array of number greater than 0.
 *     schema:
 *       type: array
 *       items:
 *         type: number
 *   - (query) parent_category_id {string} Returns categories scoped by parent
 *   - (query) offset=0 {integer} How many product categories to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of product categories returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the product category.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the product category.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetProductCategoriesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productCategories.list()
 *       .then(({ product_categories, limit, offset, count }) => {
 *         console.log(product_categories.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-categories' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Categories
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductCategoriesListRes"
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
export default async (req: Request, res: Response) => {
  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const [data, count] = await productCategoryService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    product_categories: data,
    offset,
    limit,
  })
}

// eslint-disable-next-line max-len
export class AdminGetProductCategoriesParams extends GetProductCategoriesParams {
  @IsString()
  @IsOptional()
  is_internal?: boolean

  @IsString()
  @IsOptional()
  is_active?: boolean
}

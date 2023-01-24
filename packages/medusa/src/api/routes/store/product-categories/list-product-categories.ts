import { IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { Transform } from "class-transformer"

import { ProductCategoryService } from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"
import { defaultStoreScope } from "."

/**
 * @oas [get] /product-categories
 * operationId: "GetProductCategories"
 * summary: "List Product Categories"
 * description: "Retrieve a list of product categories."
 * x-authenticated: false
 * parameters:
 *   - (query) q {string} Query used for searching product category names orhandles.
 *   - (query) parent_category_id {string} Returns categories scoped by parent
 *   - (query) offset=0 {integer} How many product categories to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of product categories returned.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductCategoriesParams
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/product-categories' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Category
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             product_categories:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProductCategory"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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

  const selectors = Object.assign(
    { ...defaultStoreScope },
    req.filterableFields
  )

  const [data, count] = await productCategoryService.listAndCount(
    selectors,
    req.listConfig,
    defaultStoreScope
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    offset,
    limit,
    product_categories: data,
  })
}

export class StoreGetProductCategoriesParams extends extendedFindParamsMixin({
  limit: 100,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  parent_category_id?: string | null
}

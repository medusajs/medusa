import { IsOptional, IsString, IsBoolean } from "class-validator"
import { Request, Response } from "express"
import { Transform } from "class-transformer"

import { ProductCategoryService } from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"
import { defaultStoreCategoryScope } from "."

/**
 * @oas [get] /store/product-categories
 * operationId: "GetProductCategories"
 * summary: "List Product Categories"
 * description: "Retrieve a list of product categories."
 * x-authenticated: false
 * parameters:
 *   - (query) q {string} Query used for searching product category names or handles.
 *   - (query) handle {string} Query used for searching product category by handle.
 *   - (query) parent_category_id {string} Returns categories scoped by parent
 *   - (query) include_descendants_tree {boolean} Include all nested descendants of category
 *   - (query) offset=0 {integer} How many product categories to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of product categories returned.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductCategoriesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.productCategories.list()
 *       .then(({ product_categories, limit, offset, count }) => {
 *         console.log(product_categories.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/product-categories' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Categories
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreGetProductCategoriesRes"
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
    { ...defaultStoreCategoryScope },
    req.filterableFields
  )

  const [data, count] = await productCategoryService.listAndCount(
    selectors,
    req.listConfig,
    defaultStoreCategoryScope
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
  handle?: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return value === "null" ? null : value
  })
  parent_category_id?: string | null

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value))
  include_descendants_tree?: boolean
}

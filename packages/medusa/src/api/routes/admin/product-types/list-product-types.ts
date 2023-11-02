import {
  DateComparisonOperator,
  FindPaginationParams,
  StringComparisonOperator,
} from "../../../../types/common"
import { IsOptional, IsString } from "class-validator"

import { IsType } from "../../../../utils/validators/is-type"
import ProductTypeService from "../../../../services/product-type"

/**
 * @oas [get] /admin/product-types
 * operationId: "GetProductTypes"
 * summary: "List Product Types"
 * description: "Retrieve a list of product types. The product types can be filtered by fields such as `q` or `value`. The product types can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=20 {integer} Limit the number of product types returned.
 *   - (query) offset=0 {integer} The number of product types to skip when retrieving the product types.
 *   - (query) order {string} A product type field to sort-order the retrieved product types by.
 *   - (query) discount_condition_id {string} Filter by the ID of a discount condition. Only product types that this discount condition is applied to will be retrieved.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: Filter by value.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by product type IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} term to search product types' values.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
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
 *     description: Filter by an update date range.
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
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetProductTypesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productTypes.list()
 *       .then(({ product_types }) => {
 *         console.log(product_types.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/product-types' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Types
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminProductTypesListRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const typeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  const { listConfig, filterableFields } = req
  const { skip, take } = req.listConfig

  const [types, count] = await typeService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    product_types: types,
    count,
    offset: skip,
    limit: take,
  })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved product types.
 */
// eslint-disable-next-line max-len
export class AdminGetProductTypesParams extends FindPaginationParams {
  /**
   * IDs to filter product types by.
   */
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  /**
   * Search terms to search product types' value.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Values to filter product types by.
   */
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  value?: string | string[] | StringComparisonOperator

  /**
   * Date filters to apply on the product types' `created_at` date.
   */
  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the product types' `updated_at` date.
   */
  @IsType([DateComparisonOperator])
  @IsOptional()
  updated_at?: DateComparisonOperator

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Filter product types by their associated discount condition's ID.
   */
  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

import {
  DateComparisonOperator,
  StringComparisonOperator,
} from "../../../../types/common"
import { IsNumber, IsOptional, IsString } from "class-validator"

import { IsType } from "../../../../utils/validators/is-type"
import ProductTagService from "../../../../services/product-tag"
import { Type } from "class-transformer"
import { Request, Response } from "express"

/**
 * @oas [get] /admin/product-tags
 * operationId: "GetProductTags"
 * summary: "List Product Tags"
 * description: "Retrieve a list of product tags. The product tags can be filtered by fields such as `q` or `value`. The product tags can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} Limit the number of product tags returned.
 *   - (query) offset=0 {integer} The number of product tags to skip when retrieving the product tags.
 *   - (query) order {string} A product tag field to sort-order the retrieved product tags by.
 *   - (query) discount_condition_id {string} Filter by the ID of a discount condition. Only product tags that this discount condition is applied to will be retrieved.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: Filter by tag value.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} term to search product tags' values.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by tag IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
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
 *   queryParams: AdminGetProductTagsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.productTags.list()
 *       .then(({ product_tags }) => {
 *         console.log(product_tags.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/product-tags' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Tags
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminProductTagsListRes"
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
export default async (req: Request, res: Response) => {
  const tagService: ProductTagService = req.scope.resolve("productTagService")
  const { listConfig, filterableFields } = req
  const { skip, take } = req.listConfig

  const [tags, count] = await tagService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    product_tags: tags,
    count,
    offset: skip,
    limit: take,
  })
}

/**
 * {@inheritDoc FindPaginationParams}
 */
export class AdminGetProductTagsPaginationParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 10
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

/**
 * Parameters used to filter and configure the pagination of the retrieved product tags.
 */
export class AdminGetProductTagsParams extends AdminGetProductTagsPaginationParams {
  /**
   * IDs to filter product tags by.
   */
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  /**
   * Search term to search product tags' value.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Values to search product tags by.
   */
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  /**
   * Date filters to apply on the product tags' `created_at` date.
   */
  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the product tags' `updated_at` date.
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
   * Filter product tags by their associated discount condition's ID.
   */
  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

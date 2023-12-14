import { IsOptional, IsString } from "class-validator"
import {
  DateComparisonOperator,
  FindPaginationParams,
  StringComparisonOperator,
} from "../../../../types/common"

import { Request, Response } from "express"
import ProductTagService from "../../../../services/product-tag"
import { IsType } from "../../../../utils/validators/is-type"

/**
 * @oas [get] /store/product-tags
 * operationId: "GetProductTags"
 * summary: "List Product Tags"
 * description: "Retrieve a list of product tags. The product tags can be filtered by fields such as `id` or `q`. The product tags can also be sorted or paginated."
 * x-authenticated: true
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductTagsParams
 * parameters:
 *   - (query) limit=20 {integer} Limit the number of product tags returned.
 *   - (query) offset=0 {integer} The number of product tags to skip when retrieving the product tags.
 *   - (query) order {string} A product-tag field to sort-order the retrieved product tags by.
 *   - (query) discount_condition_id {string} Filter by the ID of a discount condition. When provided, only tags that the discount condition applies for will be retrieved.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: Filter by tag values.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} term to search product tag's value.
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
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.productTags.list()
 *       .then(({ product_tags }) => {
 *         console.log(product_tags.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/product-tags'
 * tags:
 *   - Product Tags
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreProductTagsListRes"
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
 * Parameters used to filter and configure the pagination of the retrieved product tags.
 */
export class StoreGetProductTagsParams extends FindPaginationParams {
  /**
   * IDs to filter product tags by.
   */
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  /**
   * Search term to search product tags' values.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * Values to filter product tags by.
   */
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  value?: string | string[] | StringComparisonOperator

  /**
   * Date filters to apply to the product tags' `created_at` date.
   */
  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply to the product tags' `updated_at` date.
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
   * Filter product tags by the ID of their associated discount condition.
   */
  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

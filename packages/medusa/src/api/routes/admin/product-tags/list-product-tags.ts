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
 * @oas [get] /product-tags
 * operationId: "GetProductTags"
 * summary: "List Product Tags"
 * description: "Retrieve a list of Product Tags."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of tags to return.
 *   - (query) offset=0 {integer} The number of items to skip before the results.
 *   - (query) order {string} The field to sort items by.
 *   - (query) discount_condition_id {string} The discount condition id on which to filter the tags.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: The tag values to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} A query string to search values for
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: The tag IDs to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting product tags were created.
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
 *     description: Date comparison for when resulting product tags were updated.
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/product-tags' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Tag
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

export class AdminGetProductTagsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

export class AdminGetProductTagsParams extends AdminGetProductTagsPaginationParams {
  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsType([String, [String], StringComparisonOperator])
  value?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  order?: string

  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

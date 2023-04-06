import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { DateComparisonOperator } from "../../../../types/common"
import ProductCollectionService from "../../../../services/product-collection"
import { Type } from "class-transformer"

/**
 * @oas [get] /admin/collections
 * operationId: "GetCollections"
 * summary: "List Collections"
 * description: "Retrieve a list of Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of collections to return.
 *   - (query) offset=0 {integer} The number of collections to skip before the results.
 *   - (query) title {string} The title of collections to return.
 *   - (query) handle {string} The handle of collections to return.
 *   - (query) q {string} a search term to search titles and handles.
 *   - (query) discount_condition_id {string} The discount condition id on which to filter the product collections.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting collections were created.
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
 *     description: Date comparison for when resulting collections were updated.
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
 *     description: Date comparison for when resulting collections were deleted.
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
 *   queryParams: AdminGetCollectionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.collections.list()
 *       .then(({ collections, limit, offset, count }) => {
 *         console.log(collections.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/collections' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminCollectionsListRes"
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
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [collections, count] = await productCollectionService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    collections,
    count,
    offset: skip,
    limit: take,
  })
}

export class AdminGetCollectionsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

// eslint-disable-next-line max-len
export class AdminGetCollectionsParams extends AdminGetCollectionsPaginationParams {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  handle?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

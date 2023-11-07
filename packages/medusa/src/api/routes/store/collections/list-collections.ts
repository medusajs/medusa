import { IsArray, IsInt, IsOptional, ValidateNested } from "class-validator"

import { DateComparisonOperator } from "../../../../types/common"
import ProductCollectionService from "../../../../services/product-collection"
import { Type } from "class-transformer"

/**
 * @oas [get] /store/collections
 * operationId: "GetCollections"
 * summary: "List Collections"
 * description: "Retrieve a list of product collections. The product collections can be filtered by fields such as `handle` or `created_at`. The product collections can also be paginated."
 * parameters:
 *   - (query) offset=0 {integer} The number of product collections to skip when retrieving the product collections.
 *   - (query) limit=10 {integer} Limit the number of product collections returned.
 *   - in: query
 *     name: handle
 *     style: form
 *     explode: false
 *     description: Filter by handles
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
 *   queryParams: StoreGetCollectionsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.collections.list()
 *       .then(({ collections, limit, offset, count }) => {
 *         console.log(collections.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/collections'
 * tags:
 *   - Product Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreCollectionsListRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
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
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const { listConfig, filterableFields } = req
  const { skip, take } = req.listConfig

  const [collections, count] = await productCollectionService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({ collections, count, limit: take, offset: skip })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved product collections.
 */
export class StoreGetCollectionsParams {
  /**
   * Handles to filter product collections by.
   */
  @IsOptional()
  @IsArray()
  handle?: string[]

  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 10
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  /**
   * Date filters to apply on the product collections' `created_at` date
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the product collections' `updated_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

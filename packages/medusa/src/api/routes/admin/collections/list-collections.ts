import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import ProductCollectionService from "../../../../services/product-collection"
import { DateComparisonOperator } from "../../../../types/common"

/**
 * @oas [get] /admin/collections
 * operationId: "GetCollections"
 * summary: "List Collections"
 * description: "Retrieve a list of Product Collection. The product collections can be filtered by fields such as `handle` or `title`. The collections can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of collections to return.
 *   - (query) offset=0 {integer} The number of collections to skip when retrieving the collections.
 *   - (query) title {string} Filter collections by their title.
 *   - (query) handle {string} Filter collections by their handle.
 *   - (query) q {string} a term to search collections by their title or handle.
 *   - (query) order {string} A field to sort-order the retrieved collections by.
 *   - (query) discount_condition_id {string} Filter collections by a discount condition ID associated with them.
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
 *   - in: query
 *     name: deleted_at
 *     description: Filter by a deletion date range.
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCollections } from "medusa-react"
 *
 *       const Collections = () => {
 *         const { collections, isLoading } = useAdminCollections()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {collections && !collections.length && <span>
 *               No Product Collections
 *             </span>}
 *             {collections && collections.length > 0 && (
 *               <ul>
 *                 {collections.map((collection) => (
 *                   <li key={collection.id}>{collection.title}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Collections
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/collections' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Product Collections
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

/**
 * Parameters used to configure the pagination of the retrieved product collections.
 */
export class AdminGetCollectionsPaginationParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  /**
   * {@inheritDoc FindPaginationParams.offset}
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

/**
 * Parameters used to filter and configure the pagination of the retrieved product collections.
 */
// eslint-disable-next-line max-len
export class AdminGetCollectionsParams extends AdminGetCollectionsPaginationParams {
  /**
   * Title to filter product collections by.
   */
  @IsOptional()
  @IsString()
  title?: string

  /**
   * Handle to filter product collections by.
   */
  @IsOptional()
  @IsString()
  handle?: string

  /**
   * Date filters to apply on the product collections' `created_at` date.
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

  /**
   * Date filters to apply on the product collections' `deleted_at` date.
   */
  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * Term to search product collections by their title and handle.
   */
  @IsString()
  @IsOptional()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Filter product collections by their associated discount condition's ID.
   */
  @IsString()
  @IsOptional()
  discount_condition_id?: string
}

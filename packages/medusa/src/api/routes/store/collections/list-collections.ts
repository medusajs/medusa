import { IsArray, IsInt, IsOptional, ValidateNested } from "class-validator"

import { DateComparisonOperator } from "../../../../types/common"
import ProductCollectionService from "../../../../services/product-collection"
import { Type } from "class-transformer"

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Collections"
 * description: "Retrieve a list of Product Collection."
 * parameters:
 *   - (query) offset=0 {integer} The number of collections to skip before starting to collect the collections set
 *   - (query) limit=10 {integer} The number of collections to return
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/collections'
 * tags:
 *   - Collection
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

export class StoreGetCollectionsParams {
  @IsOptional()
  @IsArray()
  handle?: string[]

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}

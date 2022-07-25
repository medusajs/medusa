import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"
import _, { identity } from "lodash"

import { DateComparisonOperator } from "../../../../types/common"
import ProductCollectionService from "../../../../services/product-collection"
import { Type } from "class-transformer"

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (query) limit {string} The number of collections to return.
 *   - (query) offset {string} The offset of collections to return.
 *   - (query) title {string} The title of collections to return.
 *   - (query) handle {string} The handle of collections to return.
 *   - (query) q {string} a search term to search titles and handles.
 *   - (query) deleted_at {object} Date comparison for when resulting collections was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {object} Date comparison for when resulting collections was created, i.e. less than, greater than etc.
 *   - (query) updated_at {object} Date comparison for when resulting collections was updated, i.e. less than, greater than etc.
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collections:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_collection"
 *            count:
 *               type: integer
 *               description: The total number of items available
 *            offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *            limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req: Request, res: Response) => {
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const {
    validatedQuery: { limit, offset },
    filterableFields,
    listConfig
  } = req

  const [collections, count] = await productCollectionService.listAndCount(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.status(200).json({
    collections,
    count,
    offset,
    limit,
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
}

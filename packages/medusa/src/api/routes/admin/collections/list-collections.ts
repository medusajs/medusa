import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import _, { identity } from "lodash"
import {
  defaultAdminCollectionsFields,
  defaultAdminCollectionsRelations,
} from "."
import ProductCollectionService from "../../../../services/product-collection"
import { DateComparisonOperator } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
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
 *   - (query) deleted_at {DateComparisonOperator} Date comparison for when resulting collections was deleted, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting collections was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting collections was updated, i.e. less than, greater than etc.
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collection:
 *              $ref: "#/components/schemas/product_collection"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetCollectionsParams, req.query)

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const listConfig = {
    select: defaultAdminCollectionsFields,
    relations: defaultAdminCollectionsRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const filterableFields = _.omit(validated, ["limit", "offset"])

  const [collections, count] = await productCollectionService.listAndCount(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.status(200).json({
    collections,
    count,
    offset: validated.offset,
    limit: validated.limit,
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

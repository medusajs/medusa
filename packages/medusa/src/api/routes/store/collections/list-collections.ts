import { Type } from "class-transformer"
import { ValidateNested, IsOptional, IsInt } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
import { DateComparisonOperator } from "../../../../types/common"

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * parameters:
 *   - (query) offset=0 {integer} The number of collections to skip before starting to collect the collections set
 *   - (query) limit=10 {integer} The number of collections to return
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
  const validated = await validator(StoreGetCollectionsParams, req.query)
  const { limit, offset, ...filterableFields } = validated

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const listConfig = {
    skip: offset,
    take: limit,
  }

  const [collections, count] = await productCollectionService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({ collections, count, limit, offset })
}

export class StoreGetCollectionsParams {
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

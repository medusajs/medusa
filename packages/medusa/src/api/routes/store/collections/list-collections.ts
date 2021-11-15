import { IsNumberString, IsOptional } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
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
  const validatedQuery = await validator(StoreGetCollectionsParams, req.query)
  const selector = {}

  const limit = validatedQuery.limit ? parseInt(req.query.limit) : 10
  const offset = validatedQuery.offset ? parseInt(req.query.offset) : 0

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const listConfig = {
    skip: offset,
    take: limit,
  }

  const [collections, count] = await productCollectionService.listAndCount(
    selector,
    listConfig
  )

  res.status(200).json({ collections, count, limit, offset })
}

export class StoreGetCollectionsParams {
  @IsOptional()
  @IsNumberString()
  limit?: string

  @IsOptional()
  @IsNumberString()
  offset?: string
}

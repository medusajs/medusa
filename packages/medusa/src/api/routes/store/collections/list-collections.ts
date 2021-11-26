import { Type } from "class-transformer"
import { IsOptional, IsInt } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
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
  try {
    const { limit, offset } = await validator(
      StoreGetCollectionsParams,
      req.query
    )
    const selector = {}

    const productCollectionService: ProductCollectionService =
      req.scope.resolve("productCollectionService")

    const listConfig = {
      skip: offset,
      take: limit,
    }

    const [collections, count] = await productCollectionService.listAndCount(
      selector,
      listConfig
    )

    res.status(200).json({ collections, count, limit, offset })
  } catch (err) {
    console.log(err)
  }
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
}

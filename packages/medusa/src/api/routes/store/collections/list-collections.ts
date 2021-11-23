import { Type } from "class-transformer"
import { IsArray, IsEnum, IsInt, IsOptional } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { OrderingEnum } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * parameters:
 *   - (query) offset=0 {integer} The number of collections to skip before starting to collect the collections set
 *   - (query) limit=10 {integer} The number of collections to return
 *   - (query) q {string} Query based on title and handle of Collections
 *   - (query) order=title {string} Order result based on either title or created_at / updated_at. Prefix '-' to indicate DESC
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
    const { limit, offset, order, q } = await validator(
      StoreGetCollectionsParams,
      req.query
    )

    const productCollectionService: ProductCollectionService =
      req.scope.resolve("productCollectionService")

    const selector = {
      q,
    }

    const listConfig = {
      skip: offset,
      take: limit,
      // We use a prefix of '-' to indicate a descending order type.
      order: {
        [order.replace("-", "")]: order[0] === "-" ? "DESC" : "ASC",
      },
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

  @IsOptional()
  q?: string

  @IsOptional()
  @IsArray()
  tags?: string[]

  @IsEnum(OrderingEnum)
  @IsOptional
  order: OrderingEnum = OrderingEnum.asc_title
}

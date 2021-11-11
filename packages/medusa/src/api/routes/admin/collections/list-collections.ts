import { IsNumber, IsOptional } from "class-validator"
import {
  defaultAdminCollectionsFields,
  defaultAdminCollectionsRelations,
} from "."
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) limit {string} The number of collections to return.
 *   - (path) offset {string} The offset of collections to return.
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
  const validated = await validator(AdminGetCollectionsReq, req.query)

  const limit = validated.limit || 10
  const offset = validated.offset || 0

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const listConfig = {
    select: defaultAdminCollectionsFields,
    relations: defaultAdminCollectionsRelations,
    skip: offset,
    take: limit,
  }

  const [collections, count] = await productCollectionService.listAndCount(
    {},
    listConfig
  )

  res.status(200).json({ collections, count, offset, limit })
}

export class AdminGetCollectionsReq {
  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number
}

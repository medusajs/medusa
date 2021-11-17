import { IsObject, IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /collections/{id}
 * operationId: "PostCollectionsCollection"
 * summary: "Update a Product Collection"
 * description: "Updates a Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             type: string
 *             description:  The title to identify the Collection by.
 *           handle:
 *             type: string
 *             description:  An optional handle to be used in slugs, if none is provided we will kebab-case the title.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
  const { id } = req.params

  const validated = await validator(AdminPostCollectionsCollectionReq, req.body)
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const updated = await productCollectionService.update(id, validated)
  const collection = await productCollectionService.retrieve(updated.id)

  res.status(200).json({ collection })
}

export class AdminPostCollectionsCollectionReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsObject()
  @IsOptional()
  metadata?: object
}

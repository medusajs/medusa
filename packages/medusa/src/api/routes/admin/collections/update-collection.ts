import { IsArray, IsObject, IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { Request, Response } from "express"
import { ProductCollectionInput } from "../../../../types/product-collection"

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
 *           images:
 *             description: Images of the Product Collection.
 *             type: array
 *             items:
 *               type: string
 *           thumbnail:
 *             description: The thumbnail to use for the Product Collection.
 *             type: string
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
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const updated = await productCollectionService.update(
    id,
    validatedBody as ProductCollectionInput
  )
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

  @IsArray()
  @IsOptional()
  images: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string
}

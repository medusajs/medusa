import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator"
import ProductCollectionService from "../../../../services/product-collection"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /collections
 * operationId: "PostCollections"
 * summary: "Create a Product Collection"
 * description: "Creates a Product Collection."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - title
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
export default async (req: Request, res: Response) => {
  const { validatedBody } = req as { validatedBody: AdminPostCollectionsReq }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const created = await manager.transaction(async (transactionManager) => {
    return await productCollectionService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const collection = await productCollectionService.retrieve(created.id)

  res.status(200).json({ collection })
}

export class AdminPostCollectionsReq {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

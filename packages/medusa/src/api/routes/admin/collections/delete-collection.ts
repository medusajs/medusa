import ProductCollectionService from "../../../../services/product-collection"
import { Request, Response } from "express"
import { EntityManager } from "typeorm";

/**
 * @oas [delete] /collections/{id}
 * operationId: "DeleteCollectionsCollection"
 * summary: "Delete a Product Collection"
 * description: "Deletes a Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            id:
 *              type: string
 *              description: The id of the deleted Collection
 *            object:
 *              type: string
 *              description: The type of the object that was deleted.
 *            deleted:
 *              type: boolean
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productCollectionService.withTransaction(transactionManager).delete(id)
  })


  res.json({
    id,
    object: "product-collection",
    deleted: true,
  })
}

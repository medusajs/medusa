import { Request, Response } from "express"

import ProductCollectionService from "../../../../services/product-collection"

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
 *              description: Whether the collection was deleted successfully or not.
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )
  await productCollectionService.delete(id)

  res.json({
    id,
    object: "product-collection",
    deleted: true,
  })
}

import { Request, Response } from "express"

import { EntityManager } from "typeorm";
import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [delete] /collections/{id}
 * operationId: "DeleteCollectionsCollection"
 * summary: "Delete a Product Collection"
 * description: "Deletes a Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Collection.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.collections.delete(collection_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'localhost:9000/admin/collections/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *              description: The ID of the deleted Collection
 *            object:
 *              type: string
 *              description: The type of the object that was deleted.
 *              default: product-collection
 *            deleted:
 *              type: boolean
 *              description: Whether the collection was deleted successfully or not.
 *              default: true
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

import { Request, Response } from "express"

import { EntityManager } from "typeorm"
import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [delete] /collections/{id}
 * operationId: "DeleteCollectionsCollection"
 * summary: "Delete a Collection"
 * description: "Deletes a Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Collection.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.collections.delete(collection_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/collections/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminCollectionsDeleteRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productCollectionService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "product-collection",
    deleted: true,
  })
}

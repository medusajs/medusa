import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [delete] /admin/collections/{id}/products/batch
 * operationId: "DeleteProductsFromCollection"
 * summary: "Remove Product"
 * description: "Removes products associated with a Product Collection"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeleteProductsFromCollectionReq"
 * x-codegen:
 *   method: removeProducts
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/collections/{id}/products/batch' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "product_ids": [
 *               "prod_01G1G5V2MBA328390B5AXJ610F"
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminDeleteProductsFromCollectionRes"
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
  const { validatedBody } = req as {
    validatedBody: AdminDeleteProductsFromCollectionReq
  }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productCollectionService
      .withTransaction(transactionManager)
      .removeProducts(id, validatedBody.product_ids)
  })

  res.json({
    id,
    object: "product-collection",
    removed_products: validatedBody.product_ids,
  })
}

/**
 * @schema AdminDeleteProductsFromCollectionReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: "An array of Product IDs to remove from the Product Collection."
 *     type: array
 *     items:
 *       description: "The ID of a Product to add to the Product Collection."
 *       type: string
 */
export class AdminDeleteProductsFromCollectionReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[]
}

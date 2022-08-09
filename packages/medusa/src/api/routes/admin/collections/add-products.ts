import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"

import { EntityManager } from "typeorm";
import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [post] /collections/{id}/products/batch
 * operationId: "PostProductsToCollection"
 * summary: "Updates products associated with a Product Collection"
 * description: "Updates products associated with a Product Collection"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - product_ids
 *         properties:
 *           product_ids:
 *             description: "An array of Product IDs to add to the Product Collection."
 *             type: array
 *             items:
 *               description: "The ID of a Product to add to the Product Collection."
 *               type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/collections/{id}/products/batch' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "product_ids": [
 *               "prod_01G1G5V2MBA328390B5AXJ610F"
 *           ]
 *       }'
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
  const { validatedBody } = req as { validatedBody: AdminPostProductsToCollectionReq }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const collection = await manager.transaction(async (transactionManager) => {
    return await productCollectionService.withTransaction(transactionManager).addProducts(
      id,
      validatedBody.product_ids
    )
  })

  res.status(200).json({ collection })
}

export class AdminPostProductsToCollectionReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[]
}

import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm";

import ProductCollectionService from "../../../../services/product-collection"

/**
 * @oas [delete] /collections/{id}/products/batch
 * operationId: "DeleteProductsFromCollection"
 * summary: "Removes products associated with a Product Collection"
 * description: "Removes products associated with a Product Collection"
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
 *             description: "An array of Product IDs to remove from the Product Collection."
 *             type: array
 *             items:
 *               description: "The ID of a Product to add to the Product Collection."
 *               type: string
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
 *              description: "The ID of the collection"
 *            object:
 *              type: string
 *              description: "The type of object the removal was executed on"
 *              default: product-collection
 *            removed_products:
 *              description: "The IDs of the products removed from the collection"
 *              type: array
 *              items:
 *                description: "The ID of a Product to add to the Product Collection."
 *                type: string
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as { validatedBody: AdminDeleteProductsFromCollectionReq }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productCollectionService.withTransaction(transactionManager).removeProducts(id, validatedBody.product_ids)
  })

  res.json({
    id,
    object: "product-collection",
    removed_products: validatedBody.product_ids,
  })
}

export class AdminDeleteProductsFromCollectionReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[]
}

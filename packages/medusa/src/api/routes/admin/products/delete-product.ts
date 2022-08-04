import { EntityManager } from "typeorm"
import { ProductService } from "../../../../services"

/**
 * @oas [delete] /products/{id}
 * operationId: "DeleteProductsProduct"
 * summary: "Delete a Product"
 * description: "Deletes a Product and it's associated Product Variants."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Product.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: product
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req, res) => {
  const { id } = req.params

  const productService: ProductService = req.scope.resolve("productService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "product",
    deleted: true,
  })
}

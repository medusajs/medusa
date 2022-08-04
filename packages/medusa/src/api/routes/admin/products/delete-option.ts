import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { EntityManager } from "typeorm"
import { ProductService } from "../../../../services"

/**
 * @oas [delete] /products/{id}/options/{option_id}
 * operationId: "DeleteProductsProductOptionsOption"
 * summary: "Delete a Product Option"
 * description: "Deletes a Product Option. Before a Product Option can be deleted all Option Values for the Product Option must be the same. You may, for example, have to delete some of your variants prior to deleting the Product Option"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 *   - (path) option_id=* {string} The ID of the Product Option.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             option_id:
 *               type: string
 *               description: The ID of the deleted Product Option
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: option
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id, option_id } = req.params

  const productService: ProductService = req.scope.resolve("productService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService
      .withTransaction(transactionManager)
      .deleteOption(id, option_id)
  })

  const data = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({
    option_id,
    object: "option",
    deleted: true,
    product: data,
  })
}

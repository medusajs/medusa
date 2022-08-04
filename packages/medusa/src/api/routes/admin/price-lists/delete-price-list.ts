import PriceListService from "../../../../services/price-list"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /price-lists/{id}
 * operationId: "DeletePriceListsPriceList"
 * summary: "Delete a Price List"
 * description: "Deletes a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Price List to delete.
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Price List.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await priceListService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "price-list",
    deleted: true,
  })
}

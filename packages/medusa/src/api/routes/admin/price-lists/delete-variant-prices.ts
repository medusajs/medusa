import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /price-lists/{id}/variants/{variant_id}/prices
 * operationId: "DeletePriceListsPriceListVariantsVariantPrices"
 * summary: "Delete all the prices related to a specific variant in a price list"
 * description: "Delete all the prices related to a specific variant in a price list"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List that the Money Amounts that will be deleted belongs to.
 *   - (path) variant_id=* {string} The ID of the variant from which the money amount will be deleted.
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *              ids:
 *               type: array
 *               description: The price ids that have been deleted.
 *               items:
 *                 type: string
 *              object:
 *                type: string
 *                description: The type of the object that was deleted.
 *                default: money-amount
 *              deleted:
 *                type: boolean
 *                description: Whether or not the items were deleted.
 *                default: true
 */
export default async (req, res) => {
  const { id, variant_id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const manager: EntityManager = req.scope.resolve("manager")
  const [deletedPriceIds] = await manager.transaction(
    async (transactionManager) => {
      return await priceListService
        .withTransaction(transactionManager)
        .deleteVariantPrices(id, [variant_id])
    }
  )

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}

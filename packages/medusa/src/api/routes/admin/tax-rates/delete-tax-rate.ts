import { EntityManager } from "typeorm"
import { TaxRateService } from "../../../../services"

/**
 * @oas [delete] /tax-rates/{id}
 * operationId: "DeleteTaxRatesTaxRate"
 * summary: "Delete a Tax Rate"
 * description: "Deletes a Tax Rate"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Shipping Option.
 * tags:
 *   - Tax Rate
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Shipping Option.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: tax-rate
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
 */
export default async (req, res) => {
  const { id } = req.params
  const taxRateService: TaxRateService = req.scope.resolve("taxRateService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await taxRateService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id: id,
    object: "tax-rate",
    deleted: true,
  })
}

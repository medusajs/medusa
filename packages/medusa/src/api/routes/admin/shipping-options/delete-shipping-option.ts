import { EntityManager } from "typeorm"

/**
 * @oas [delete] /shipping-options/{id}
 * operationId: "DeleteShippingOptionsOption"
 * summary: "Delete a Shipping Option"
 * description: "Deletes a Shipping Option."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Shipping Option.
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Shipping Option.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { option_id } = req.params
  const optionService = req.scope.resolve("shippingOptionService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await optionService
      .withTransaction(transactionManager)
      .delete(option_id)
  })

  res.json({
    id: option_id,
    object: "shipping-option",
    deleted: true,
  })
}

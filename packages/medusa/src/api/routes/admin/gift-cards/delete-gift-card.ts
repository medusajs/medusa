import { EntityManager } from "typeorm"

/**
 * @oas [delete] /gift-cards/{id}
 * operationId: "DeleteGiftCardsGiftCard"
 * summary: "Delete a Gift Card"
 * description: "Deletes a Gift Card"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Gift Card to delete.
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Gift Card
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: gift-card
 *             deleted:
 *               type: boolean
 *               description: Whether the gift card was deleted successfully or not.
 *               default: true
 */
export default async (req, res) => {
  const { id } = req.params

  const giftCardService = req.scope.resolve("giftCardService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await giftCardService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "gift-card",
    deleted: true,
  })
}

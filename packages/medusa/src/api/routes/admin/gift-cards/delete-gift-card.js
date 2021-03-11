/**
 * @oas [delete] /gift-cards/{id}
 * operationId: "DeleteGiftCardsGiftCard"
 * summary: "Delete a Gift Card"
 * description: "Deletes a Gift Card"
 * parameters:
 *   - (path) id=* {string} The id of the Gift Card to delete.
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
 *               description: The id of the deleted Gift Card
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id } = req.params

  try {
    const giftCardService = req.scope.resolve("giftCardService")
    await giftCardService.delete(id)

    res.json({
      id,
      object: "gift-card",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

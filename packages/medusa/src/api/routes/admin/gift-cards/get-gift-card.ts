import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "./"

/**
 * @oas [get] /gift-cards/{id}
 * operationId: "GetGiftCardsGiftCard"
 * summary: "Retrieve a Gift Card"
 * description: "Retrieves a Gift Card."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Gift Card.
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             gift_card:
 *               $ref: "#/components/schemas/gift_card"
 */
export default async (req, res) => {
  const { id } = req.params

  const giftCardService = req.scope.resolve("giftCardService")
  const giftCard = await giftCardService.retrieve(id, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}

import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /gift-cards
 * operationId: "GetGiftCards"
 * summary: "List Gift Cards"
 * description: "Retrieves a list of Gift Cards."
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             gift_cards:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/gift_card"
 */
export default async (req, res) => {
  try {
    const selector = {}

    const giftCardService = req.scope.resolve("giftCardService")

    const giftCards = await giftCardService.list(selector, {
      select: defaultFields,
      relations: defaultRelations,
      order: { created_at: "DESC" },
    })

    res.status(200).json({ gift_cards: giftCards })
  } catch (err) {
    throw err
  }
}

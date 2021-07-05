import { MedusaError, Validator } from "medusa-core-utils"
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
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    const giftCardService = req.scope.resolve("giftCardService")

    const giftCards = await giftCardService.list(selector, {
      select: defaultFields,
      relations: defaultRelations,
      order: { created_at: "DESC" },
      limit: limit,
      skip: offset,
    })

    res.status(200).json({ gift_cards: giftCards })
  } catch (err) {
    throw err
  }
}

import { defaultAdminPriceListFields, defaultAdminPriceListRelations } from "."
import { PriceList } from "../../../.."
import PriceListService from "../../../../services/price-list"

/**
 * @oas [get] /price-lists/{id}
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

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const priceList = await priceListService.retrieve(id, {
    select: defaultAdminPriceListFields as (keyof PriceList)[],
    relations: defaultAdminPriceListRelations,
  })

  res.status(200).json({ price_list: priceList })
}

import { IsInt, IsOptional, IsString } from "class-validator"

import { GiftCardService } from "../../../../services"
import { Type } from "class-transformer"
import { pickBy } from "lodash"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /gift-cards
 * operationId: "GetGiftCards"
 * summary: "List Gift Cards"
 * description: "Retrieves a list of Gift Cards."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {number} The number of items to skip before the results.
 *   - (query) limit=50 {number} Limit the number of items returned.
 *   - (query) q {string} a search term to search by code or display ID
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
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const validated = await validator(AdminGetGiftCardsParams, req.query)

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")

  const [giftCards, count] = await giftCardService.listAndCount(
    pickBy(req.filterableFields, (val) => typeof val !== "undefined"),
    req.listConfig
  )

  res.status(200).json({
    gift_cards: giftCards,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetGiftCardsParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit = 50

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset = 0

  @IsOptional()
  @IsString()
  q?: string
}

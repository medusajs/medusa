import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"
import { pickBy } from "lodash"
import { GiftCardService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /gift-cards
 * operationId: "GetGiftCards"
 * summary: "List Gift Cards"
 * description: "Retrieves a list of Gift Cards."
 * x-authenticated: true
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

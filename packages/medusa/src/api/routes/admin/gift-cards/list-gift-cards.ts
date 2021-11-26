import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"
import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "."
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

  const selector = {}

  if (validated.q && typeof validated.q !== "undefined") {
    selector["q"] = validated.q
  }

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")

  const giftCards = await giftCardService.list(selector, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
    order: { created_at: "DESC" },
    limit: validated.limit,
    skip: validated.offset,
  })

  res.status(200).json({
    gift_cards: giftCards,
    count: giftCards.length,
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

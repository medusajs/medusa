import { IsOptional, IsString } from "class-validator"
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

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector = {}

  if (validated.q && typeof validated.q !== "undefined") {
    selector["q"] = validated.q
  }

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")

  const giftCards = await giftCardService.list(selector, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
    order: { created_at: "DESC" },
    limit: limit,
    skip: offset,
  })

  res.status(200).json({ gift_cards: giftCards })
}

export class AdminGetGiftCardsParams {
  @IsOptional()
  @IsString()
  limit?: number

  @IsOptional()
  @IsString()
  offset?: number

  @IsOptional()
  @IsString()
  q?: string
}

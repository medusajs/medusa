import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from "class-validator"
import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "."
import { GiftCardService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /gift-cards
 * operationId: "PostGiftCards"
 * summary: "Create a Gift Card"
 * description: "Creates a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           value:
 *             type: integer
 *             description: The value (excluding VAT) that the Gift Card should represent.
 *           is_disabled:
 *             type: boolean
 *             description: Whether the Gift Card is disabled on creation. You will have to enable it later to make it available to Customers.
 *           ends_at:
 *             type: string
 *             format: date-time
 *             description: The time at which the Gift Card should no longer be available.
 *           region_id:
 *             description: The id of the Region in which the Gift Card can be used.
 *             type: array
 *             items:
 *               type: string
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
  const validated = await validator(AdminPostGiftCardsReq, req.body)

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")

  const newly = await giftCardService.create({
    ...validated,
    balance: validated.value,
  })

  const giftCard = await giftCardService.retrieve(newly.id, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}

export class AdminPostGiftCardsReq {
  @IsOptional()
  @IsInt()
  value?: number

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ends_at?: Date

  @IsOptional()
  @IsBoolean()
  is_disabled?: boolean

  @IsOptional()
  @IsString()
  region_id?: string

  @IsOptional()
  metadata?: object
}

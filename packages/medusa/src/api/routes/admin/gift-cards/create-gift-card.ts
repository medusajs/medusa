import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from "class-validator"
import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "."

import { GiftCardService } from "../../../../services"
import { Type } from "class-transformer"
import { EntityManager } from "typeorm"

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
 *         $ref: "#/components/schemas/AdminPostGiftCardsReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.giftCards.create({
 *         region_id
 *       })
 *       .then(({ gift_card }) => {
 *         console.log(gift_card.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/gift-cards' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "region_id": "{region_id}"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminGiftCardsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const validatedBody: AdminPostGiftCardsReq & { balance?: number } =
    req.validatedBody
  validatedBody.balance = validatedBody.value

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")
  const manager: EntityManager = req.scope.resolve("manager")
  const newly = await manager.transaction(async (transactionManager) => {
    return await giftCardService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const giftCard = await giftCardService.retrieve(newly.id, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}

/**
 * @schema AdminPostGiftCardsReq
 * type: object
 * required:
 *   - region_id
 * properties:
 *   value:
 *     type: integer
 *     description: The value (excluding VAT) that the Gift Card should represent.
 *   is_disabled:
 *     type: boolean
 *     description: Whether the Gift Card is disabled on creation. You will have to enable it later to make it available to Customers.
 *   ends_at:
 *     type: string
 *     format: date-time
 *     description: The time at which the Gift Card should no longer be available.
 *   region_id:
 *     description: The ID of the Region in which the Gift Card can be used.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
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

  @IsString()
  region_id: string

  @IsOptional()
  metadata?: Record<string, unknown>
}

import { IsInt, IsOptional, IsString } from "class-validator"

import { GiftCardService } from "../../../../services"
import { Type } from "class-transformer"
import { pickBy } from "lodash"
import { validator } from "../../../../utils/validator"
import { isDefined } from "medusa-core-utils"

/**
 * @oas [get] /admin/gift-cards
 * operationId: "GetGiftCards"
 * summary: "List Gift Cards"
 * description: "Retrieves a list of Gift Cards."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {number} The number of items to skip before the results.
 *   - (query) limit=50 {number} Limit the number of items returned.
 *   - (query) q {string} a search term to search by code or display ID
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetGiftCardsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.giftCards.list()
 *       .then(({ gift_cards, limit, offset, count }) => {
 *         console.log(gift_cards.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/gift-cards' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Gift Cards
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminGiftCardsListRes"
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
  const validated = await validator(AdminGetGiftCardsParams, req.query)

  const giftCardService: GiftCardService = req.scope.resolve("giftCardService")

  const [giftCards, count] = await giftCardService.listAndCount(
    pickBy(req.filterableFields, (val) => isDefined(val)),
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

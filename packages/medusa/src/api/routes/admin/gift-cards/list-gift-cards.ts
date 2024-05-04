import { IsInt, IsOptional, IsString } from "class-validator"

import { Type } from "class-transformer"
import { pickBy } from "lodash"
import { isDefined } from "medusa-core-utils"
import { GiftCardService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/gift-cards
 * operationId: "GetGiftCards"
 * summary: "List Gift Cards"
 * description: "Retrieve a list of Gift Cards. The gift cards can be filtered by fields such as `q`. The gift cards can also paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {number} The number of gift cards to skip when retrieving the gift cards.
 *   - (query) limit=50 {number} Limit the number of gift cards returned.
 *   - (query) q {string} a term to search gift cards' code or display ID
 *   - (query) order {string} A gift card field to sort-order the retrieved gift cards by.
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { GiftCard } from "@medusajs/medusa"
 *       import { useAdminGiftCards } from "medusa-react"
 *
 *       const CustomGiftCards = () => {
 *         const { gift_cards, isLoading } = useAdminGiftCards()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {gift_cards && !gift_cards.length && (
 *               <span>No custom gift cards...</span>
 *             )}
 *             {gift_cards && gift_cards.length > 0 && (
 *               <ul>
 *                 {gift_cards.map((giftCard: GiftCard) => (
 *                   <li key={giftCard.id}>{giftCard.code}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default CustomGiftCards
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/gift-cards' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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

/**
 * Parameters used to filter and configure the pagination of the retrieved gift cards.
 */
export class AdminGetGiftCardsParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset = 0

  /**
   * Search term to search gift cards by their code and display ID.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsOptional()
  @IsString()
  order?: string
}

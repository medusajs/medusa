import { defaultStoreGiftCardFields, defaultStoreGiftCardRelations } from "."

import GiftCardService from "../../../../services/gift-card"

/**
 * @oas [get] /store/gift-cards/{code}
 * operationId: "GetGiftCardsCode"
 * summary: "Get Gift Card by Code"
 * description: "Retrieves a Gift Card by its associated unique code."
 * parameters:
 *   - (path) code=* {string} The unique Gift Card code.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.giftCards.retrieve(code)
 *       .then(({ gift_card }) => {
 *         console.log(gift_card.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/gift-cards/{code}'
 * tags:
 *   - Gift Cards
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreGiftCardsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const { code } = req.params

  try {
    const giftCardService: GiftCardService =
      req.scope.resolve("giftCardService")
    const giftCard = await giftCardService.retrieveByCode(code, {
      select: defaultStoreGiftCardFields,
      relations: defaultStoreGiftCardRelations,
    })

    res.json({ gift_card: giftCard })
  } catch (error) {
    console.log(error)
    throw error
  }
}

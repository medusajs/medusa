import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "./"

/**
 * @oas [get] /gift-cards/{id}
 * operationId: "GetGiftCardsGiftCard"
 * summary: "Retrieve a Gift Card"
 * description: "Retrieves a Gift Card."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Gift Card.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.giftCards.retrieve(gift_card_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/gift-cards/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
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

  const giftCardService = req.scope.resolve("giftCardService")
  const giftCard = await giftCardService.retrieve(id, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}

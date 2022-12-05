import { CartService, DraftOrderService } from "../../../../services"
import {
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."

import { DraftOrder } from "../../../.."

/**
 * @oas [get] /draft-orders/{id}
 * operationId: "GetDraftOrdersDraftOrder"
 * summary: "Get a Draft Order"
 * description: "Retrieves a Draft Order."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.retrieve(draft_order_id)
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/draft-orders/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
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
  const { id } = req.params

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")
  const cartService: CartService = req.scope.resolve("cartService")

  const draftOrder: DraftOrder = await draftOrderService.retrieve(id, {
    select: defaultAdminDraftOrdersFields,
    relations: defaultAdminDraftOrdersRelations,
  })

  draftOrder.cart = await cartService.retrieveWithTotals(
    draftOrder.cart_id,
    {
      relations: defaultAdminDraftOrdersCartRelations,
    },
    {
      force_taxes: true,
    }
  )

  res.json({ draft_order: draftOrder })
}

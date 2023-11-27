import { CartService, DraftOrderService } from "../../../../services"
import {
  defaultAdminDraftOrdersCartFields,
  defaultAdminDraftOrdersCartRelations,
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."

import { DraftOrder } from "../../../.."
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /admin/draft-orders/{id}
 * operationId: "GetDraftOrdersDraftOrder"
 * summary: "Get a Draft Order"
 * description: "Retrieve a Draft Order's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.draftOrders.retrieve(draftOrderId)
 *       .then(({ draft_order }) => {
 *         console.log(draft_order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/draft-orders/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Draft Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDraftOrdersRes"
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

  draftOrder.cart = await cartService.retrieveWithTotals(draftOrder.cart_id, {
    relations: defaultAdminDraftOrdersCartRelations,
    select: defaultAdminDraftOrdersCartFields,
  })

  res.json({
    draft_order: cleanResponseData(draftOrder, []),
  })
}

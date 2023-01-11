import { IInventoryService } from "../../../../interfaces"
import { OrderService } from "../../../../services"

/**
 * @oas [get] /orders/{id}/reservations
 * operationId: "GetOrdersOrderReservations"
 * summary: "Get reservations for an Order"
 * description: "Retrieves reservations for an Order"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.retrieveReservations(order_id)
 *       .then(({ reservations }) => {
 *         console.log(reservations[0].id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/orders/{id}/reservations' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             reservations:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ReservationItemDTO"
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

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const orderService: OrderService = req.scope.resolve("orderService")

  const order = await orderService.retrieve(id, { relations: ["items"] })

  const [reservations] = await inventoryService.listReservationItems({
    line_item_id: order.items.map((i) => i.id),
  })

  res.json({ reservations })
}

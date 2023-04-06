import { IInventoryService } from "@medusajs/types"
import { Request, Response } from "express"
import { OrderService } from "../../../../services"
import { extendedFindParamsMixin } from "../../../../types/common"

/**
 * @oas [get] /admin/orders/{id}/reservations
 * operationId: "GetOrdersOrderReservations"
 * summary: "Get reservations for an Order"
 * description: "Retrieves reservations for an Order"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) offset=0 {integer} How many reservations to skip before the results.
 *   - (query) limit=20 {integer} Limit the number of reservations returned.
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
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReservationsListRes"
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
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const orderService: OrderService = req.scope.resolve("orderService")

  const order = await orderService.retrieve(id, { relations: ["items"] })

  const [reservations, count] = await inventoryService.listReservationItems(
    {
      line_item_id: order.items.map((i) => i.id),
    },
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({ reservations, count, limit, offset })
}

// eslint-disable-next-line max-len
export class AdminGetOrdersOrderReservationsParams extends extendedFindParamsMixin(
  {
    limit: 20,
    offset: 0,
  }
) {}

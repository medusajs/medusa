import { OrderService } from "../../../../services"
import { ExtendedRequest } from "../../../../types/global"
import { Order } from "../../../../models"

/**
 * @oas [get] /orders/cart/{cart_id}
 * operationId: GetOrdersOrderCartId
 * summary: Get by Cart ID
 * description: "Retrieves an Order by the id of the Cart that was used to create the Order."
 * parameters:
 *   - (path) cart_id=* {string} The ID of Cart.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orders.retrieveByCartId(cart_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/orders/cart/{id}'
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
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
export default async (req: ExtendedRequest<Order>, res) => {
  const { cart_id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const order = await orderService.retrieveByCartId(cart_id, req.retrieveConfig)

  res.json({ order })
}

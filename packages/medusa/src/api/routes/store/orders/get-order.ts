import { defaultStoreOrdersFields, defaultStoreOrdersRelations } from "./index"

import { OrderService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /orders/{id}
 * operationId: GetOrdersOrder
 * summary: Get an Order
 * description: "Retrieves an Order"
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (query) fields {string} (Comma separated) Which fields should be included in the result.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in the result.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orders.retrieve(order_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/orders/{id}'
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreOrdersRes"
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
  const { id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig)

  res.json({
    order: cleanResponseData(order, req.allowedProperties || []),
  })
}

export class StoreGetOrderParams extends FindParams {}

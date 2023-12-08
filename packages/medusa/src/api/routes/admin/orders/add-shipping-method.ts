import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"

import { OrderService } from "../../../../services"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/orders/{id}/shipping-methods
 * operationId: "PostOrdersOrderShippingMethods"
 * summary: "Add a Shipping Method"
 * description: "Add a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced."
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderShippingMethodsReq"
 * x-authenticated: true
 * x-codegen:
 *   method: addShippingMethod
 *   params: AdminPostOrdersOrderShippingMethodsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.addShippingMethod(orderId, {
 *         price: 1000,
 *         option_id
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/shipping-methods' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "price": 1000,
 *           "option_id": "{option_id}"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
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

  const validated = req.validatedBody

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .addShippingMethod(id, validated.option_id, validated.data, {
        price: validated.price,
      })
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.status(200).json({ order: cleanResponseData(order, []) })
}

/**
 * @schema AdminPostOrdersOrderShippingMethodsReq
 * type: object
 * description: "The shipping method's details."
 * required:
 *   - price
 *   - option_id
 * properties:
 *   price:
 *     type: number
 *     description: The price (excluding VAT) that should be charged for the Shipping Method
 *   option_id:
 *     type: string
 *     description: The ID of the Shipping Option to create the Shipping Method from.
 *   data:
 *     type: object
 *     description: The data required for the Shipping Option to create a Shipping Method. This depends on the Fulfillment Provider.
 */
export class AdminPostOrdersOrderShippingMethodsReq {
  @IsInt()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  option_id: string

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown> = {}
}

export class AdminPostOrdersOrderShippingMethodsParams extends FindParams {}

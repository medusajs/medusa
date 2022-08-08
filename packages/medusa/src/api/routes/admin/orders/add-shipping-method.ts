import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { EntityManager } from "typeorm"
import { OrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders/{id}/shipping-methods
 * operationId: "PostOrdersOrderShippingMethods"
 * summary: "Add a Shipping Method"
 * description: "Adds a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (body) price=* {integer} The price (excluding VAT) that should be charged for the Shipping Method
 *   - (body) option_id=* {string} The ID of the Shipping Option to create the Shipping Method from.
 *   - (body) data {object} The data required for the Shipping Option to create a Shipping Method. This will depend on the Fulfillment Provider.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.addShippingMethod(order_id, {
 *         price: 1000,
 *         option_id
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'localhost:9000/admin/orders/{id}/shipping-methods' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "price": 1000,
 *           "option_id": "{option_id}"
 *       }'
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
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderShippingMethodsReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .addShippingMethod(id, validated.option_id, validated.data, {
        price: validated.price,
      })
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

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

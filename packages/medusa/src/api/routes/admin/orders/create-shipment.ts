import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."

import { EntityManager } from "typeorm"
import { OrderService } from "../../../../services"
import { TrackingLink } from "../../../../models"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders/{id}/shipment
 * operationId: "PostOrdersOrderShipment"
 * summary: "Create a Shipment"
 * description: "Registers a Fulfillment as shipped."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - fulfillment_id
 *         properties:
 *           fulfillment_id:
 *             description: The ID of the Fulfillment.
 *             type: string
 *           tracking_numbers:
 *             description: The tracking numbers for the shipment.
 *             type: array
 *             items:
 *               type: string
 *           no_notification:
 *             description: If set to true no notification will be send related to this Shipment.
 *             type: boolean
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createShipment(order_id, {
 *         fulfillment_id
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/shipment' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "fulfillment_id": "{fulfillment_id}"
 *       }'
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
 *             order:
 *               $ref: "#/components/schemas/Order"
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

  const validated = await validator(AdminPostOrdersOrderShipmentReq, req.body)

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .createShipment(
        id,
        validated.fulfillment_id,
        validated.tracking_numbers?.map((n) => ({
          tracking_number: n,
        })) as TrackingLink[],
        {
          metadata: {},
          no_notification: validated.no_notification,
        }
      )
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order })
}

export class AdminPostOrdersOrderShipmentReq {
  @IsString()
  @IsNotEmpty()
  fulfillment_id: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tracking_numbers?: string[]

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

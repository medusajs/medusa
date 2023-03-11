import { EntityManager } from "typeorm";
import { FulfillmentService } from "../../../../services"
import { FindParams } from "../../../../types/common";
import { IsDate, IsOptional } from "class-validator";
import { MedusaError } from "medusa-core-utils"
import { Type } from "class-transformer";
import { validator } from "../../../../utils/validator";

/**
 * @oas [post] /admin/orders/{id}/fulfillments/{fulfillment_id}/delivery
 * operationId: "PostOrdersOrderFulfillmentsDelivery"
 * summary: "Mark fulfillment as delivered"
 * description: "Marks fulfillment as delivered."
 * parameters:
 *   - (path) id=* {string} The ID of the Order which the Fulfillment relates to.
 *   - (path) fulfillment_id=* {string} The ID of the Fulfillment
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderFulfillmentsDeliveryReq"
 * x-authenticated: true
 * x-codegen:
 *   method: markDelivered
 *   params: AdminPostOrdersOrderFulfillmentsDeliveryParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.markDelivered(fulfillmentId, time)
 *       .then(({ fulfillment }) => {
 *         console.log(fulfillment.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/fulfillments/{fulfillment_id}/delivery' \
 *       --header 'Authorization: Bearer {api_token}'
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "time": "2023-03-11T01:57:15.224Z",
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Fulfillment
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFulfillmentRes"
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
  const { id, fulfillment_id } = req.params
  const validated = await validator(AdminPostOrdersOrderFulfillmentsDeliveryReq, req.body)
  const fulfillmentId = fulfillment_id
  const fulfillmentService: FulfillmentService = req.scope.resolve("fulfillmentService")
  let fulfillment = await fulfillmentService.retrieve(fulfillmentId)
  
  if (!fulfillment) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Fulfillment with id: ${fulfillmentId} was not found`
    )
  }
  
  if (fulfillment.order_id !== id) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `no fulfillment was found with the id: ${fulfillmentId} related to order: ${id}`
    )
  }
  
  const manager: EntityManager = req.scope.resolve("manager")
  fulfillment = await manager.transaction(async (transactionManager) => {
    return await fulfillmentService
      .withTransaction(transactionManager)
      .markDelivered(fulfillment_id, validated.time)
  })
 
  res.status(200).json({ fulfillment })
}

/**
 * @schema AdminPostOrdersOrderFulfillmentsDeliveryReq
 * type: object
 * properties:
 *   time:
 *     type: date
 *     description: The delivery time
 */
export class AdminPostOrdersOrderFulfillmentsDeliveryReq {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  time?: Date
}

export class AdminPostOrdersOrderFulfillmentsDeliveryParams extends FindParams {}
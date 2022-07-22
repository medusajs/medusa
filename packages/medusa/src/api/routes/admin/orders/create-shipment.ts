import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminOrdersRelations, defaultAdminOrdersFields } from "."
import { OrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { TrackingLink } from "../../../../models"
/**
 * @oas [post] /orders/{id}/shipment
 * operationId: "PostOrdersOrderShipment"
 * summary: "Create a Shipment"
 * description: "Registers a Fulfillment as shipped."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - fulfillment_id
 *         properties:
 *           fulfillment_id:
 *             description: The id of the Fulfillment.
 *             type: string
 *           tracking_numbers:
 *             description: The tracking numbers for the shipment.
 *             type: array
 *             items:
 *               type: string
 *           no_notification:
 *             description: If set to true no notification will be send related to this Shipment.
 *             type: boolean
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

  const validated = await validator(AdminPostOrdersOrderShipmentReq, req.body)

  const orderService: OrderService = req.scope.resolve("orderService")

  await orderService.createShipment(
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

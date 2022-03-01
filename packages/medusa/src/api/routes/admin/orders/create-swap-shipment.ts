import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."
import { OrderService, SwapService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/shipments
 * operationId: "PostOrdersOrderSwapsSwapShipments"
 * summary: "Create Swap Shipment"
 * description: "Registers a Swap Fulfillment as shipped."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) swap_id=* {string} The id of the Swap.
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
 *             description: If set to true no notification will be send related to this Claim.
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
  const { id, swap_id } = req.params

  const validated = await validator(
    AdminPostOrdersOrderSwapsSwapShipmentsReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")

  await swapService.createShipment(
    swap_id,
    validated.fulfillment_id,
    validated.tracking_numbers?.map((n) => ({ tracking_number: n })),
    { no_notification: validated.no_notification }
  )

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.json({ order })
}

export class AdminPostOrdersOrderSwapsSwapShipmentsReq {
  @IsString()
  @IsNotEmpty()
  fulfillment_id: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tracking_numbers?: string[] = []

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

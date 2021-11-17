import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { defaultAdminOrdersRelations, defaultAdminOrdersFields } from "."
import { OrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /orders/{id}/refunds
 * operationId: "PostOrdersOrderRefunds"
 * summary: "Create a Refund"
 * description: "Issues a Refund."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - amount
 *           - reason
 *         properties:
 *           amount:
 *             description: The amount to refund.
 *             type: integer
 *           reason:
 *             description: The reason for the Refund.
 *             type: string
 *           note:
 *             description: A not with additional details about the Refund.
 *             type: string
 *           no_notification:
 *             description: If set to true no notification will be send related to this Refund.
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

  const validated = await validator(AdminPostOrdersOrderRefundsReq, req.body)

  const orderService: OrderService = req.scope.resolve("orderService")

  await orderService.createRefund(
    id,
    validated.amount,
    validated.reason,
    validated.note,
    {
      no_notification: validated.no_notification,
    }
  )

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

export class AdminPostOrdersOrderRefundsReq {
  @IsInt()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  reason: string

  @IsString()
  @IsOptional()
  note?: string

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

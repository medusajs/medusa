import { Type } from "class-transformer"
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator"
import { EntityManager } from "typeorm"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "."
import { OrderService, SwapService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [post] /orders/{id}/swaps/{swap_id}/receive
 * operationId: "PostOrdersOrderSwapsSwapReceive"
 * summary: "Receive a Swap"
 * description: "Registers a Swap as received."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (path) swap_id=* {string} The id of the Swap.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           items:
 *             description: The Line Items that have been received.
 *             type: array
 *             items:
 *               properties:
 *                 item_id:
 *                   description: The id of the Line Item.
 *                   type: string
 *                 quantity:
 *                   description: The quantity of the Line Item.
 *                   type: integer
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
    AdminPostOrdersOrderSwapsSwapReceiveReq,
    req.body
  )

  const orderService: OrderService = req.scope.resolve("orderService")
  const swapService: SwapService = req.scope.resolve("swapService")
  const entityManager: EntityManager = req.scope.resolve("manager")

  await entityManager.transaction(async (manager) => {
    await swapService
      .withTransaction(manager)
      .receiveReturn(swap_id, validated.items)

    await orderService
      .withTransaction(manager)
      .registerSwapReceived(id, swap_id)
  })

  const order = await orderService.retrieve(id, {
    select: defaultAdminOrdersFields,
    relations: defaultAdminOrdersRelations,
  })

  res.status(200).json({ order })
}

export class AdminPostOrdersOrderSwapsSwapReceiveReq {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[]
}

class Item {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsInt()
  @IsNotEmpty()
  quantity: number
}

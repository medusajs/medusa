import { Type } from "class-transformer"
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { defaultStoreOrdersFields, defaultStoreOrdersRelations } from "."
import { OrderService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /orders
 * operationId: "GetOrders"
 * summary: "Look Up an Order"
 * description: "Looks for an Order with a given `display_id`, `email` pair. The `display_id`, `email` pair must match in order for the Order to be returned."
 * parameters:
 *   - (query) display_id=* {number} The display id given to the Order.
 *   - (query) email=* {string} The email of the Order with the given display_id.
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
  const validated = await validator(StoreGetOrdersParams, req.query)

  const orderService: OrderService = req.scope.resolve("orderService")

  const orders = await orderService.list(
    {
      display_id: validated.display_id,
      email: validated.email,
    },
    {
      select: defaultStoreOrdersFields,
      relations: defaultStoreOrdersRelations,
    }
  )

  if (orders.length !== 1) {
    res.sendStatus(404)
    return
  }

  const order = orders[0]

  res.json({ order })
}

export class ShippingAddressPayload {
  @IsOptional()
  @IsString()
  postal_code?: string
}

export class StoreGetOrdersParams {
  @IsNumber()
  @Type(() => Number)
  display_id: number

  @IsEmail()
  email: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressPayload)
  shipping_address?: ShippingAddressPayload
}

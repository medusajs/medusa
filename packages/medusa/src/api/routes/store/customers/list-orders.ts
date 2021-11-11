import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Order } from "../../../.."
import OrderService from "../../../../services/order"
import { PaginatedResponse } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import {
  allowedFields,
  allowedRelations,
  defaultFields,
  defaultRelations,
} from "../orders"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * x-authenticated: true
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_methods:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const orderService: OrderService = req.scope.resolve("orderService")

  const selector = {
    customer_id: id,
  }

  const validated = await validator(
    StoreGetCustomersCustomerOrdersQuery,
    req.query
  )

  const limit = validated.limit || 10
  const offset = validated.offset || 0

  let includeFields: string[] = []
  if (validated.fields) {
    includeFields = validated.fields.split(",")
    includeFields = includeFields.filter((f) => allowedFields.includes(f))
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
    expandFields = expandFields.filter((f) => allowedRelations.includes(f))
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [orders, count] = await orderService.listAndCount(selector, listConfig)

  res.json({ orders, count, offset, limit })
}

export type StoreGetCustomersCustomerOrdersResponse = PaginatedResponse & {
  orders: Order[]
}

export class StoreGetCustomersCustomerOrdersQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
  @IsOptional()
  @IsString()
  fields?: string
  @IsOptional()
  @IsString()
  expand?: string
}

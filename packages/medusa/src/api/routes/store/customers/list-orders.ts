import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  allowedStoreOrdersFields,
  allowedStoreOrdersRelations,
} from "../orders"
import { FindConfig } from "../../../../types/common"
import { Order } from "../../../../models"

import OrderService from "../../../../services/order"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} How many orders to return.
 *   - (query) offset=0 {integer} The offset in the resulting orders.
 *   - (query) fields {string} (Comma separated string) Which fields should be included in the resulting orders.
 *   - (query) expand {string} (Comma separated string) Which relations should be expanded in the resulting orders.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const id: string = req.user.customer_id

  const orderService: OrderService = req.scope.resolve("orderService")

  const selector = {
    customer_id: id,
  }

  const validated = await validator(
    StoreGetCustomersCustomerOrdersParams,
    req.query
  )

  let includeFields: string[] = []
  if (validated.fields) {
    includeFields = validated.fields.split(",")
    includeFields = includeFields.filter((f) =>
      allowedStoreOrdersFields.includes(f)
    )
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
    expandFields = expandFields.filter((f) =>
      allowedStoreOrdersRelations.includes(f)
    )
  }

  const listConfig = {
    select: includeFields.length ? includeFields : allowedStoreOrdersFields,
    relations: expandFields.length ? expandFields : allowedStoreOrdersRelations,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  } as FindConfig<Order>

  const [orders, count] = await orderService.listAndCount(selector, listConfig)

  res.json({ orders, count, offset: validated.offset, limit: validated.limit })
}

export class StoreGetCustomersCustomerOrdersParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit = 10

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset = 0

  @IsOptional()
  @IsString()
  fields?: string

  @IsOptional()
  @IsString()
  expand?: string
}

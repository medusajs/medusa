import { IsNumber, IsOptional, IsString } from "class-validator"

import { AdminListOrdersSelector } from "../../../../types/orders"
import { OrderService } from "../../../../services"
import { Type } from "class-transformer"
import { pick } from "lodash"

/**
 * @oas [get] /orders
 * operationId: "GetOrders"
 * summary: "List Orders"
 * description: "Retrieves a list of Orders"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching orders by shipping address first name, orders' email, and orders' display ID
 *   - (query) id {string} Id of the order to search for.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Status to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [pending, completed, archived, canceled, requires_action]
 *   - in: query
 *     name: fulfillment_status
 *     style: form
 *     explode: false
 *     description: Fulfillment status to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [not_fulfilled, fulfilled, partially_fulfilled, shipped, partially_shipped, canceled, returned, partially_returned, requires_action]
 *   - in: query
 *     name: payment_status
 *     style: form
 *     explode: false
 *     description: Payment status to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [captured, awaiting, not_paid, refunded, partially_refunded, canceled, requires_action]
 *   - (query) display_id {string} Display id to search for.
 *   - (query) cart_id {string} to search for.
 *   - (query) customer_id {string} to search for.
 *   - (query) email {string} to search for.
 *   - (query) region_id {string} to search for.
 *   - (query) currency_code {string} to search for.
 *   - (query) tax_rate {string} to search for.
 *   - (query) cancelled_at {object} Date comparison for when resulting orders was cancelled, i.e. less than, greater than etc.
 *   - (query) created_at {object} Date comparison for when resulting orders was created, i.e. less than, greater than etc.
 *   - (query) updated_at {object} Date comparison for when resulting orders was updated, i.e. less than, greater than etc.
 *   - (query) offset=0 {integer} How many orders to skip before the results.
 *   - (query) limit=50 {integer} Limit the number of orders returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each order of the result.
 * tags:
 *   - Order
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
  const orderService: OrderService = req.scope.resolve("orderService")

  const { skip, take, select, relations } = req.listConfig

  const [orders, count] = await orderService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  let data = orders

  const fields = [...select, ...relations]
  if (fields.length) {
    data = orders.map((o) => pick(o, fields))
  }

  res.json({ orders: data, count, offset: skip, limit: take })
}

export class AdminGetOrdersParams extends AdminListOrdersSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}

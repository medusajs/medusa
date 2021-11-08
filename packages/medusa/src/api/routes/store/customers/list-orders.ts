import OrderService from "../../../../services/order"
import {
  defaultRelations,
  defaultFields,
  allowedFields,
  allowedRelations,
} from "../orders"
import { PaginatedResponse } from "../../../../types/common"
import { Order } from "../../../.."

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
 *             count:
 *               description: The total number of Orders.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Orders to return,
 *               type: integer
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/orders"
 */
export default async (req, res) => {
  const id: string = req.user.customer_id

  const orderService = req.scope.resolve("orderService") as OrderService

  const selector = {
    customer_id: id,
  }

  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  let includeFields = []
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
    includeFields = includeFields.filter(f => allowedFields.includes(f))
  }

  let expandFields = []
  if ("expand" in req.query) {
    expandFields = req.query.expand.split(",")
    expandFields = expandFields.filter(f => allowedRelations.includes(f))
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

export type ListCustomerOrdersReponse = PaginatedResponse & {
  orders: Order[]
}

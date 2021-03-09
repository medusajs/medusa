import _ from "lodash"
import { Not } from "typeorm"
import { defaultRelations, defaultFields } from "./"
/**
 * @oas [get] /orders
 * operationId: "GetOrders"
 * summary: "List Orders"
 * description: "Retrieves an list of Orders"
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
  try {
    const orderService = req.scope.resolve("orderService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    let selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    let includeFields = []
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
    }

    let expandFields = []
    if ("expand" in req.query) {
      expandFields = req.query.expand.split(",")
    }

    if ("new" in req.query) {
      selector = {
        payment_status: Not("captured"),
        fulfillment_status: Not("shipped"),
      }
    }

    if ("requires_more" in req.query) {
      selector = {
        payment_status: Not("captured"),
        fulfillment_status: Not("shipped"),
      }
    }

    const listConfig = {
      select: includeFields.length ? includeFields : defaultFields,
      relations: expandFields.length ? expandFields : defaultRelations,
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }

    const [orders, count] = await orderService.listAndCount(
      selector,
      listConfig
    )

    const fields = [...includeFields, ...expandFields]
    const data = orders.map(o => _.pick(o, fields))

    res.json({ orders: data, count, offset, limit })
  } catch (error) {
    throw error
  }
}

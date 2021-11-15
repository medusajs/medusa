import {
  allowedStoreOrdersFields,
  allowedStoreOrdersRelations,
  defaultStoreOrdersFields,
  defaultStoreOrdersRelations,
} from "../orders"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
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

  const orderService = req.scope.resolve("orderService")

  const selector = {
    customer_id: id,
  }

  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  let includeFields = []
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
    includeFields = includeFields.filter((f) =>
      allowedStoreOrdersFields.includes(f)
    )
  }

  let expandFields = []
  if ("expand" in req.query) {
    expandFields = req.query.expand.split(",")
    expandFields = expandFields.filter((f) =>
      allowedStoreOrdersRelations.includes(f)
    )
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultStoreOrdersFields,
    relations: expandFields.length ? expandFields : defaultStoreOrdersRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [orders, count] = await orderService.listAndCount(selector, listConfig)

  res.json({ orders, count, offset, limit })
}

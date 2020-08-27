import _ from "lodash"

export default async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "display_id",
      "email",
      "status",
      "fulfillment_status",
      "payment_status",
    ])

    const limit = parseInt(req.query.limit) || 0
    const offset = parseInt(req.query.offset) || 0

    let orders = await orderService.list(query, offset, limit)

    orders = await Promise.all(
      orders.map(order => orderService.decorate(order))
    )

    let numOrders = await orderService.count()

    res.json({ orders, total_count: numOrders })
  } catch (error) {
    throw error
  }
}

import _ from "lodash"

export default async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "email",
      "status",
      "fulfillment_status",
      "payment_status",
    ])

    let orders = await orderService.list(query)

    orders = await Promise.all(
      orders.map(order => orderService.decorate(order))
    )

    res.json({ orders })
  } catch (error) {
    throw error
  }
}

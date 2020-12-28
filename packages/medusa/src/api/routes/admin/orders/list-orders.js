import _ from "lodash"

export default async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    let query = queryBuilderService.buildQuery(req.query, [
      "display_id",
      "email",
      "status",
      "fulfillment_status",
      "payment_status",
    ])

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    let orders

    // Temporary solution for admin tabs filtering
    // Will be replaced in Mongo -> Postgres migration
    if (req.query["status"]) {
      if (req.query["status"] === "returns") {
        query = {
          "returns.status": "requested",
        }
      }

      if (req.query["status"] === "new") {
        query = {
          $or: [
            { fulfillment_status: { $ne: "shipped" } },
            { payment_status: { $ne: "captured" } },
          ],
        }
      }

      if (req.query["status"] === "requires_action") {
        query = {
          $or: [
            { status: "requires_action" },
            { payment_status: "requires_action" },
            { fulfillment_status: "requires_action" },
          ],
        }
      }

      if (req.query["status"] === "swaps") {
        const swapService = req.scope.resolve("swapService")

        const swapsInProgress = await swapService.list({
          fulfillment_status: { $ne: "shipped" },
        })

        if (swapsInProgress.length) {
          query = {
            swaps: { $in: swapsInProgress.map(s => s._id.toString()) },
          }
        }
      }
    }

    orders = await orderService.list(query, offset, limit)

    let includeFields = []
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
    }

    orders = await Promise.all(
      orders.map(order => orderService.decorate(order, includeFields))
    )

    let numOrders = await orderService.count()

    res.json({ orders, total_count: numOrders })
  } catch (error) {
    throw error
  }
}

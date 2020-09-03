export default async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "email",
      "first_name",
      "last_name",
    ])

    const limit = parseInt(req.query.limit) || 0
    const offset = parseInt(req.query.offset) || 0

    const customers = await customerService.list(query, offset, limit)

    const numCustomers = await customerService.count()

    res.json({ customers, total_count: numCustomers })
  } catch (error) {
    throw error
  }
}

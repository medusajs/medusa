export default async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "email",
      "first_name",
      "last_name",
    ])

    const customers = await customerService.list(query)

    res.json({ customers })
  } catch (error) {
    throw error
  }
}

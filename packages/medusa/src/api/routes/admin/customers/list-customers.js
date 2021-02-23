export default async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    const listConfig = {
      relations: [],
      skip: offset,
      take: limit,
    }

    const [customers, count] = await customerService.listAndCount(
      selector,
      listConfig
    )

    res.json({ customers, count, offset, limit })
  } catch (error) {
    throw error
  }
}

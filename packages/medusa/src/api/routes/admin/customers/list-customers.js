export default async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const listConfig = {
      relations: [],
      skip: offset,
      take: limit,
    }

    const customers = await customerService.list({}, listConfig)

    res.json({ customers, count: customers.length, offset, limit })
  } catch (error) {
    throw error
  }
}

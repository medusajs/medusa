import _ from "lodash"

export default async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    const listConfig = {
      select: ["total"],
      relations: [],
      skip: offset,
      take: limit,
    }

    const [orders, count] = await orderService.listAndCount(
      selector,
      listConfig
    )

    res.json({ orders, count, offset, limit })
  } catch (error) {
    throw error
  }
}

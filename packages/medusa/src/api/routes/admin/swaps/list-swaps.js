import _ from "lodash"

export default async (req, res) => {
  try {
    const swapService = req.scope.resolve("swapService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    const listConfig = {
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }

    const swaps = await swapService.list(selector, { ...listConfig })

    res.json({ swaps, count: swaps.length, offset, limit })
  } catch (error) {
    throw error
  }
}

export default async (req, res) => {
  try {
    const regionService = req.scope.resolve("regionService")

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const listOptions = {
      selector: {},
      skip: offset,
      take: limit,
    }

    let regions = await regionService.list(listOptions)

    res.json({ regions, count: regions.length, offset, limit })
  } catch (err) {
    throw err
  }
}

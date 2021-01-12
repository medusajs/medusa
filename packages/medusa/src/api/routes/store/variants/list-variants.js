export default async (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  let selector = {}

  const listConfig = {
    relations: [],
    skip: offset,
    take: limit,
  }

  if ("ids" in req.query) {
    selector = { id: req.query.ids.split(",") }
  }

  const variantService = req.scope.resolve("productVariantService")
  const variants = await variantService.list(selector, listConfig)

  res.json({ variants })
}

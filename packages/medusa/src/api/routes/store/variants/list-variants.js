import { Any } from "typeorm"

export default async (req, res) => {
  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  const listConfig = {
    relations: [],
    skip: offset,
    take: limit,
  }

  if ("ids" in req.query) {
    selector["id"] = { id: req.query.ids.split(",") }
  }

  const variantService = req.scope.resolve("productVariantService")
  const variants = await variantService.list(selector, listConfig)

  res.json({ variants })
}

import _ from "lodash"
import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    if ("is_giftcard" in req.query) {
      selector.is_giftcard = req.query.is_giftcard === "true"
    }

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    let products = await productService.list(selector, listConfig)

    res.json({ products, count: products.length, offset, limit })
  } catch (error) {
    throw error
  }
}

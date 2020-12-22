import _ from "lodash"

export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const listOptions = {
      selector: {},
      relations: ["variants"],
      skip: offset,
      take: limit,
    }

    let products = await productService.list(listOptions)

    res.json({ products, count: products.length, offset, limit })
  } catch (error) {
    throw error
  }
}

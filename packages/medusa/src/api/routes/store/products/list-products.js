import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const selector = {}

  const productService = req.scope.resolve("productService")
  const products = await productService.list(selector)

  res.json(products)
}

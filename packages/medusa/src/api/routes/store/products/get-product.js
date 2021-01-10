import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id, [
    "images",
    "variants",
    "options",
  ])

  res.json({ product })
}

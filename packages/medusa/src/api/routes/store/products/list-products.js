import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const selector = {}

  const productService = req.scope.resolve("productService")
  const products = await productService.list(selector)

  const data = await Promise.all(
    products.map(p =>
      productService.decorate(
        p,
        [
          "title",
          "description",
          "tags",
          "handle",
          "images",
          "options",
          "variants",
          "published",
        ],
        ["variants"]
      )
    )
  )

  res.json(data)
}

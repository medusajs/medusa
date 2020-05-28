import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { productId } = req.params

  const schema = Validator.objectId()
  const { value, error } = schema.validate(productId)

  if (error) {
    throw error
  }

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(value)

  product = await productService.decorate(
    product,
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

  res.json({ product })
}

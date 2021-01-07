import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.objectId()
  const { value, error } = schema.validate(productId)

  if (error) {
    throw error
  }

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(value, [
    "images",
    "variants",
    "options",
  ])

  res.json({ product })
}

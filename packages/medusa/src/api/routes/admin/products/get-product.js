import { defaultExpandFields, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.decorate(
    id,
    defaultFields,
    defaultExpandFields
  )

  res.json({ product })
}

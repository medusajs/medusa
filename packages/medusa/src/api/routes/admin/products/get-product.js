import { defaultExpandFields, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id, [...defaultFields])

  res.json({ product })
}

import { defaultRelations, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id, defaultRelations)

  res.json({ product })
}

import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")

  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ product })
}

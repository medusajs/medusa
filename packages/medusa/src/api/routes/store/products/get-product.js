export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id, {
    relations: ["images", "variants", "options"],
  })

  res.json({ product })
}

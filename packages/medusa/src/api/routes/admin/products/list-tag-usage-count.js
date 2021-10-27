export default async (req, res) => {
  const productService = req.scope.resolve("productService")

  const tags = await productService.listTagsByUsage()

  res.json({ tags })
}

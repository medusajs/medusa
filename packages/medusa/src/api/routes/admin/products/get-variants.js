export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  const variants = await productService.retrieveVariants(id)

  res.json({ variants })
}

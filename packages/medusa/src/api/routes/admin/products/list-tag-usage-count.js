export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const tags = await productService.listTagsByUsage()

    res.json({ tags })
  } catch (error) {
    throw error
  }
}

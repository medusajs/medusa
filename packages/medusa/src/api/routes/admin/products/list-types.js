export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const types = await productService.listTypes()

    res.json({ types })
  } catch (error) {
    throw error
  }
}

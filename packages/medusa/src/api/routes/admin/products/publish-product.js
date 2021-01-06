export default async (req, res) => {
  const { id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.publish(id)

    res.json({ product })
  } catch (error) {
    throw error
  }
}

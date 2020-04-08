export default async (req, res) => {
  const { id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.delete(id)
    res.json({
      id,
      object: "product",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

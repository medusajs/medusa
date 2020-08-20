export default async (req, res) => {
  const { id, option_id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.deleteOption(id, option_id)
    res.json({
      option_id,
      object: "option",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

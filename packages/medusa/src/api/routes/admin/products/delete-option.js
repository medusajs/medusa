export default async (req, res) => {
  const { id, optionId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.deleteOption(id, optionId)
    res.json({
      optionId,
      object: "option",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

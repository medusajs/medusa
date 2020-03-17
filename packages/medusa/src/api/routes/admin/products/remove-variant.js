export default async (req, res) => {
  const { id, variantId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.removeVariant(id, variantId)
    res.json({
      id: variantId,
      object: "variant",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

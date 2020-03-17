export default async (req, res) => {
  const { id, variantId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.retrieve(id)
    await productService.addVariant(product._id, variantId)
    const newProduct = await productService.retrieve(product.id)
    res.json(newProduct)
  } catch (err) {
    console.log(err)
    throw err
  }
}

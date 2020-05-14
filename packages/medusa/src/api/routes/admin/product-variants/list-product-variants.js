export default async (req, res) => {
  try {
    const productVariantService = req.scope.resolve("productVariantService")
    const productVariants = await productVariantService.list({})

    res.json(productVariants)
  } catch (error) {
    throw error
  }
}

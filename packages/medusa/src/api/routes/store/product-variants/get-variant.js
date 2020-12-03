export default async (req, res) => {
  const { id } = req.params
  try {
    const productVariantService = req.scope.resolve("productVariantService")
    const data = await productVariantService.retrieve(id)

    res.status(200).json({ variant: data })
  } catch (err) {
    throw err
  }
}

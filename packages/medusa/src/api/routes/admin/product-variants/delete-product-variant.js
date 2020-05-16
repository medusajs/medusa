export default async (req, res) => {
  const { id } = req.params

  try {
    const productVariantService = req.scope.resolve("productVariantService")
    await productVariantService.delete(id)

    res.json({
      id: id,
      object: "productVariant",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

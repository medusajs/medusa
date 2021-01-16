export default async (req, res) => {
  const { variant_id } = req.params

  try {
    const productVariantService = req.scope.resolve("productVariantService")
    await productVariantService.delete(variant_id)

    res.json({
      variant_id,
      object: "product-variant",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

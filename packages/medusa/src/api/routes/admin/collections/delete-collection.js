export default async (req, res) => {
  const { id } = req.params

  try {
    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )
    await productCollectionService.delete(id)

    res.json({
      id,
      object: "product-collection",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

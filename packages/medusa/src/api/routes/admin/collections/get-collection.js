export default async (req, res) => {
  const { id } = req.params
  try {
    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const collection = await productCollectionService.retrieve(id)
    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}

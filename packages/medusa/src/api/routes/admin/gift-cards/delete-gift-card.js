export default async (req, res) => {
  const { id } = req.params

  try {
    const giftCardService = req.scope.resolve("giftCardService")
    await giftCardService.delete(id)

    res.json({
      id,
      object: "gift-card",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

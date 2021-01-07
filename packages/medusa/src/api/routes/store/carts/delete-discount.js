export default async (req, res) => {
  const { id, code } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.removeDiscount(id, code)
    const cart = await cartService.retrieve(id, ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

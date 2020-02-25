export default async (req, res) => {
  const { id } = req.params

  const cartService = req.scope.resolve("cartService")
  const cart = await cartService.retrieve(id)

  if (!cart) {
    res.sendStatus(404)
    return
  }

  res.json(cart)
}

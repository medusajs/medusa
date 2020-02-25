export default async (req, res) => {
  const { cartId } = req.params

  const cartService = req.scope.resolve("cartService")
  const cart = await cartService.retrieve(cartId)

  if (!cart) {
    res.sendStatus(404)
    return
  }

  res.json(cart)
}

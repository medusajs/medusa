export default async (req, res) => {
  const { id } = req.params

  const cartService = req.scope.resolve("cartService")
  let cart = await cartService.retrieve(id)

  if (!cart) {
    res.sendStatus(404)
    return
  }

  cart = await cartService.decorate(cart)

  res.json(cart)
}

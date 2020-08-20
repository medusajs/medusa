export default async (req, res) => {
  const { id } = req.params
  try {
    const cartService = req.scope.resolve("cartService")
    let cart = await cartService.retrieve(id)
    cart = await cartService.decorate(cart)
    res.json({ cart })
  } catch (err) {
    throw err
  }
}

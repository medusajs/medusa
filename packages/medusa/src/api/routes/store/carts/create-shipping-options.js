export default async (req, res) => {
  const { id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    // Ask the cart service to set payment sessions
    await cartService.setShippingOptions(id)

    // return the updated cart
    let cart = await cartService.retrieve(id)
    cart = await cartService.decorate(cart)
    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  const { id } = req.params
  try {
    const cartService = req.scope.resolve("cartService")
    let cart = await cartService.retrieve(id)

    // If there is a logged in user add the user to the cart
    if (req.user && req.user.customer_id) {
      if (
        !cart.customer_id ||
        !cart.email ||
        cart.customer_id !== req.user.customer_id
      ) {
        cart = await cartService.update(id, {
          customer_id: req.user.customer_id,
        })
      }
    }

    cart = await cartService.decorate(cart, [], ["region"])
    res.json({ cart })
  } catch (err) {
    throw err
  }
}

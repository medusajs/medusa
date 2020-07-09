export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { merchant_data, selected_shipping_option } = req.body

  try {
    const cartService = req.resolve("cartService")
    const klarnaProviderService = req.resolve("pp_klarna")

    const cart = await cartService.retrieve(merchant_data)
    const updatedMethod = cart.shipping_options.find(
      (so) => so._id === selected_shipping_option.id
    )

    if (updatedMethod) {
      await cartService.update(cart._id, {
        shipping_methods: [updatedMethod],
      })

      // Fetch and return updated Klarna order
      const updatedCart = await cartService.retrieve(cart._id)
      const order = klarnaProviderService.cartToKlarnaOrder(updatedCart)
      res.json(order)
      return
    } else {
      res.sendStatus(400)
      return
    }
  } catch (error) {
    throw error
  }
}

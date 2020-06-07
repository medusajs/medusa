export default async (req, res) => {
  const { klarna_order_id } = req.query

  try {
    const cartService = req.resolve("cartService")
    const klarnaProviderService = req.resolve("pp_klarna")

    const order = await klarnaProviderService.retrieveCompletedOrder(
      klarna_order_id
    )

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

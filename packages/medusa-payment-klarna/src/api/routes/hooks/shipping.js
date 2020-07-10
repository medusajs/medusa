export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { merchant_data, selected_shipping_option } = req.body

  try {
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const cart = await cartService.retrieve(merchant_data)
    const shippingOptions = await shippingProfileService.fetchCartOptions(cart)

    const option = shippingOptions.find(({ _id }) => _id === selected_shipping_option.id)

    if (option) {
      await cartService.addShippingMethod(cart._id, option._id, option.data)

      // Fetch and return updated Klarna order
      const updatedCart = await cartService.retrieve(cart._id)
      const order = klarnaProviderService.cartToKlarnaOrder(updatedCart)
      res.json(order)
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    throw error
  }
}

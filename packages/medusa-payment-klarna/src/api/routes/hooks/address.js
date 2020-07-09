export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { shipping_address, merchant_data } = req.body

  try {
    const cartService = req.resolve("cartService")
    const klarnaProviderService = req.resolve("pp_klarna")

    const cart = await cartService.retrieve(merchant_data)

    if (shipping_address) {
      const updatedAddress = {
        email: shipping_address.email,
        street_address: shipping_address.address_1,
        street_address2: shipping_address.address_2,
        postal_code: shipping_address.postal_code,
        city: shipping_address.city,
        country: shipping_address.country_code,
      }

      await cartService.update(cart._id, {
        email: shipping_address.email,
        shipping_address: updatedAddress,
        billing_address: updatedAddress,
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

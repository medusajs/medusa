export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { shipping_address, merchant_data } = req.body

  try {
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const cart = await cartService.retrieve(merchant_data)

    if (shipping_address) {
      const updatedAddress = {
        first_name: shipping_address.given_name,
        last_name: shipping_address.family_name,
        address_1: shipping_address.street_address,
        address_2: shipping_address.street_address2,
        city: shipping_address.city,
        country_code: shipping_address.country.toUpperCase(),
        postal_code: shipping_address.postal_code,
        phone: shipping_address.phone
      }
      
      await cartService.updateShippingAddress(cart._id, updatedAddress)
      await cartService.updateBillingAddress(cart._id, updatedAddress)
      await cartService.updateEmail(cart._id, shipping_address.email)

      const shippingOptions = await shippingProfileService.fetchCartOptions(cart)
      if (shippingOptions.length === 1) {
        const option = shippingOptions[0]
        await cartService.addShippingMethod(cart._id, option._id, option.data)
      }

      // Fetch and return updated Klarna order
      const updatedCart = await cartService.retrieve(cart._id)
      const order = await klarnaProviderService.cartToKlarnaOrder(updatedCart)
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

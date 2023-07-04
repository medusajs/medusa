export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { merchant_data, selected_shipping_option } = req.body

  try {
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const cart = await cartService.retrieveWithTotals(
      merchant_data,
      {
        relations: [
          "shipping_address",
          "billing_address",
          "region",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.adjustments",
          "items.variant",
          "items.variant.product",
        ],
      },
      { force_taxes: true }
    )
    let shippingOptions = await shippingProfileService.fetchCartOptions(cart)

    shippingOptions = shippingOptions.filter(
      (so) => !so.data?.require_drop_point
    )

    const ids = selected_shipping_option.id.split(".")
    for (const id of ids) {
      const option = shippingOptions.find((so) => so.id === id)
      if (option) {
        await cartService.addShippingMethod(cart.id, option.id, option.data)
      }
    }

    const newCart = await cartService.retrieveWithTotals(
      cart.id,
      {
        relations: [
          "shipping_address",
          "billing_address",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "region",
          "items",
          "items.adjustments",
          "items.variant",
          "items.variant.product",
        ],
      },
      { force_taxes: true }
    )

    const order = await klarnaProviderService.cartToKlarnaOrder(newCart)

    res.json(order)
  } catch (error) {
    throw error
  }
}

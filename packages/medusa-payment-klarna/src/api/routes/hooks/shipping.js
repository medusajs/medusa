export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { merchant_data, selected_shipping_option } = req.body

  try {
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const cart = await cartService.retrieve(merchant_data, {
      select: ["subtotal"],
      relations: [
        "shipping_address",
        "billing_address",
        "region",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "items",
        "items.variant",
        "items.variant.product",
      ],
    })
    let shippingOptions = await shippingProfileService.fetchCartOptions(cart)

    shippingOptions = shippingOptions.filter(
      (so) => !so.data?.require_drop_point
    )

    const ids = selected_shipping_option.id.split(".")
    await Promise.all(
      ids.map(async (id) => {
        const option = shippingOptions.find((so) => so.id === id)

        if (option) {
          await cartService.addShippingMethod(cart.id, option.id, option.data)
        }
      })
    )

    const newCart = await cartService.retrieve(cart.id, {
      select: [
        "gift_card_total",
        "subtotal",
        "total",
        "tax_total",
        "discount_total",
        "subtotal",
      ],
      relations: [
        "shipping_address",
        "billing_address",
        "shipping_methods",
        "shipping_methods.shipping_option",
        "region",
        "items",
        "items.variant",
        "items.variant.product",
      ],
    })

    const order = await klarnaProviderService.cartToKlarnaOrder(newCart)
    res.json(order)
  } catch (error) {
    throw error
  }
}

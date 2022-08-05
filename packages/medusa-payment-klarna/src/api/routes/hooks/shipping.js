export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { merchant_data, selected_shipping_option } = req.body

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const newCart = await manager.transaction(async (m) => {
      const cartServiceTx = cartService.withTransaction(m)
      const cart = await cartServiceTx.retrieve(merchant_data, {
        select: ["subtotal"],
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
      })
      let shippingOptions = await shippingProfileService.withTransaction(m).fetchCartOptions(cart)

      shippingOptions = shippingOptions.filter(
          (so) => !so.data?.require_drop_point
      )

      const ids = selected_shipping_option.id.split(".")
      for (const id of ids) {
        const option = shippingOptions.find((so) => so.id === id)
        if (option) {
          await cartServiceTx.addShippingMethod(cart.id, option.id, option.data)
        }
      }

      return await cartServiceTx.retrieve(cart.id, {
        select: [
          "gift_card_total",
          "subtotal",
          "total",
          "shipping_total",
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
          "items.adjustments",
          "items.variant",
          "items.variant.product",
        ],
      })
    })

    const order = await klarnaProviderService.cartToKlarnaOrder(newCart)

    res.json(order)
  } catch (error) {
    throw error
  }
}

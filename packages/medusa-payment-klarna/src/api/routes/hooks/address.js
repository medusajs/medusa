export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { shipping_address, merchant_data } = req.body

  const cartService = req.scope.resolve("cartService")
  const klarnaProviderService = req.scope.resolve("pp_klarna")
  const shippingProfileService = req.scope.resolve("shippingProfileService")

  if (shipping_address) {
    const shippingAddress = {
      first_name: shipping_address.given_name,
      last_name: shipping_address.family_name,
      address_1: shipping_address.street_address,
      address_2: shipping_address.street_address2,
      city: shipping_address.city,
      country_code: shipping_address.country,
      postal_code: shipping_address.postal_code,
      phone: shipping_address.phone,
    }

    let billingAddress = {
      first_name: shipping_address.given_name,
      last_name: shipping_address.family_name,
      address_1: shipping_address.street_address,
      address_2: shipping_address.street_address2,
      city: shipping_address.city,
      country_code: shipping_address.country,
      postal_code: shipping_address.postal_code,
      phone: shipping_address.phone,
    }

    await cartService.update(merchant_data, {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      email: shipping_address.email,
    })

    let cart = await cartService.retrieveWithTotals(merchant_data, {
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
    const shippingOptions = await shippingProfileService.fetchCartOptions(cart)

    if (shippingOptions?.length) {
      const option = shippingOptions.find(
        (o) => o.data && !o.data.require_drop_point
      )
      if (option) {
        await cartService.addShippingMethod(cart.id, option.id, option.data)
        cart = await cartService.retrieveWithTotals(cart.id, {
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
      }
    }

    const order = await klarnaProviderService.cartToKlarnaOrder(cart)
    res.json(order)
  } else {
    res.sendStatus(400)
    return
  }
}

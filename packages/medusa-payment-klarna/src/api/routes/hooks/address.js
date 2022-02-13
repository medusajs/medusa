export default async (req, res) => {
  // In Medusa, we store the cart id in merchant_data
  const { shipping_address, merchant_data } = req.body

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    const result = await manager.transaction("SERIALIZABLE", async (m) => {
      const cart = await cartService.retrieve(merchant_data, {
        select: ["subtotal"],
        relations: [
          "shipping_address",
          "billing_address",
          "region",
          "items",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items.variant",
          "items.variant.product",
        ],
      })

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

        const billingAddress = {
          first_name: shipping_address.given_name,
          last_name: shipping_address.family_name,
          address_1: shipping_address.street_address,
          address_2: shipping_address.street_address2,
          city: shipping_address.city,
          country_code: shipping_address.country,
          postal_code: shipping_address.postal_code,
          phone: shipping_address.phone,
        }

        await cartService.update(cart.id, {
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          email: shipping_address.email,
        })

        const shippingOptions = await shippingProfileService.fetchCartOptions(
          cart
        )

        if (shippingOptions?.length) {
          const option = shippingOptions.find(
            (o) => o.data && !o.data.require_drop_point
          )
          await cartService
            .withTransaction(m)
            .addShippingMethod(cart.id, option.id, option.data)
        }

        // Fetch and return updated Klarna order
        const updatedCart = await cartService
          .withTransaction(m)
          .retrieve(cart.id, {
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
              "region",
              "shipping_methods",
              "shipping_methods.shipping_option",
              "items",
              "items.variant",
              "items.variant.product",
            ],
          })
        return klarnaProviderService.cartToKlarnaOrder(updatedCart)
      } else {
        return null
      }
    })

    if (result) {
      res.json(result)
      return
    } else {
      res.sendStatus(400)
      return
    }
  } catch (error) {
    throw error
  }
}

export default async (req, res) => {
  const { id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    // Ask the cart service to set payment sessions
    await cartService.setPaymentSessions(id)

    // return the updated cart
    const cart = await cartService.retrieve(id, {
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "total",
      ],
      relations: [
        "region",
        "region.countries",
        "region.payment_providers",
        "shipping_methods",
        "payment_sessions",
        "shipping_methods.shipping_option",
      ],
    })

    res.status(200).json({ cart })
  } catch (err) {
    console.log(err)
    throw err
  }
}

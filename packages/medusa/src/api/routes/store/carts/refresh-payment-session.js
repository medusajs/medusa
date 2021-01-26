export default async (req, res) => {
  const { id, provider_id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.refreshPaymentSession(id, provider_id)
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
    throw err
  }
}

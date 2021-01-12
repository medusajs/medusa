export default async (req, res) => {
  const { cart_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.retrieveByCartId(cart_id, {
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "total",
      ],
      relations: [
        "shipping_address",
        "items",
        "items.variant",
        "items.variant.product",
        "shipping_methods",
        "discounts",
        "customer",
        "payments",
        "region",
      ],
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}

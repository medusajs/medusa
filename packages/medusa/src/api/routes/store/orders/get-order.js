export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.retrieve(id)
    order = await orderService.decorate(
      order,
      [
        "status",
        "fulfillment_status",
        "payment_status",
        "email",
        "billing_address",
        "shipping_address",
        "items",
        "region",
        "discounts",
        "customer_id",
        "payment_method",
        "shipping_methods",
        "shipping_total",
        "discount_total",
        "tax_total",
        "subtotal",
        "total",
        "metadata",
      ],
      ["region"]
    )

    res.json({ order })
  } catch (error) {
    throw error
  }
}

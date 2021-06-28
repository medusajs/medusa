export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")

    const order = await orderService.retrieve(id, {
      relations: [
        "order",
        "additional_items",
        "return_order",
        "fulfillments",
        "payment",
        "items",
        "items.variant",
        "items.variant.product",
        "shipping_address",
        "shipping_methods",
        "cart",
      ],
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}

export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.retrieve(id, [
      "billing_adress",
      "shipping_address",
      "items",
      "region",
      "discounts",
      "customer",
      "shipping_methods",
      "payments",
    ])

    res.json({ order })
  } catch (error) {
    throw error
  }
}

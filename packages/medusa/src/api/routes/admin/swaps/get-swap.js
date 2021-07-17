export default async (req, res) => {
  const { id } = req.params

  try {
    const swapService = req.scope.resolve("swapService")

    const swap = await swapService.retrieve(id, {
      relations: [
        "order",
        "additional_items",
        "return_order",
        "fulfillments",
        "payment",
        "shipping_address",
        "shipping_methods",
        "cart",
      ],
    })

    res.json({ swap })
  } catch (error) {
    throw error
  }
}

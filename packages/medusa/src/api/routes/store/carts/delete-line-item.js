export default async (req, res) => {
  const { id, line_id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.removeLineItem(id, line_id)
    const cart = await cartService.retrieve(id, {
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "total",
      ],
      relations: ["region", "items"],
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

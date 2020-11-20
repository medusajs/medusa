export default async (req, res) => {
  const { id, swap_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")

    const order = await orderService.retrieve(id)

    await swapService.capturePayment(swap_id)

    // Decorate the order
    const data = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )

    res.json({ order: data })
  } catch (error) {
    throw error
  }
}

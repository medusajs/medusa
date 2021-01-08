export default async (req, res) => {
  const { id, swap_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")

    let order = await orderService.retrieve(id)

    await swapService.processDifference(swap_id)

    // Decorate the order
    order = await orderService.retrieve(id, ["region", "customer", "swaps"])

    res.json({ order })
  } catch (error) {
    throw error
  }
}

export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.completeOrder(id)
    order = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )
    res.json({ order })
  } catch (error) {
    throw error
  }
}

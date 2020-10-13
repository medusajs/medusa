export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.cancel(id)
    order = await orderService.decorate(order, [], ["region"])
    res.json({ order })
  } catch (error) {
    throw error
  }
}

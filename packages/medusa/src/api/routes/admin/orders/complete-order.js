export default async (req, res) => {
  const { id } = req.params

  const orderService = req.scope.resolve("orderService")

  await orderService.completeOrder(id)

  const order = await orderService.retrieve(id, {
    relations: ["region", "customer", "swaps"],
  })

  res.json({ order })
}

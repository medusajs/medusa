export default async (req, res) => {
  const { id } = req.params

  const orderService = req.scope.resolve("orderService")
  const order = await orderService.retrieve(id)

  if (!order) {
    res.sendStatus(404)
    return
  }

  res.json(order)
}

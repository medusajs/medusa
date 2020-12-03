export default async (req, res) => {
  const { id, key } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.deleteMetadata(id, key)
    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

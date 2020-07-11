export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.completeOrder(id)
    res.json({ order })
  } catch (error) {
    console.log(error)
    throw error
  }
}

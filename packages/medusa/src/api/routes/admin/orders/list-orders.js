export default async (req, res) => {
  const selector = {}

  try {
    const orderService = req.scope.resolve("orderService")
    const orders = await orderService.list(selector)

    res.json({ orders })
  } catch (error) {
    throw error
  }
}

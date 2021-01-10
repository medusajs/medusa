export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")

    const order = await orderService.retrieve(id, {
      select: ["total"],
      relations: ["items", "payments", "region", "customer", "swaps"],
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}

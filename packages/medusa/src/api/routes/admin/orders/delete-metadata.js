export default async (req, res) => {
  const { id, key } = req.params

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.deleteMetadata(id, key)

    const order = await orderService.retrieve(id, {
      relations: ["region", "customer", "swaps"],
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

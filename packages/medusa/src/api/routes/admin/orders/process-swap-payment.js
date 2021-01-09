export default async (req, res) => {
  const { id, swap_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const swapService = req.scope.resolve("swapService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      await swapService.withTransaction(manager).processDifference(swap_id)

      const order = await orderService
        .withTransaction(manager)
        .retrieve(id, ["region", "customer", "swaps"])

      res.json({ order })
    })
  } catch (error) {
    throw error
  }
}

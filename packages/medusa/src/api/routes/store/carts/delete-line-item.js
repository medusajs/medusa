import { defaultFields, defaultRelations } from "./"
export default async (req, res) => {
  const { id, line_id } = req.params

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")

    await manager.transaction(async m => {
      // Remove the line item
      await cartService.withTransaction(m).removeLineItem(id, line_id)

      // If the cart has payment sessions update these
      const updated = await cartService.withTransaction(m).retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length) {
        await cartService.withTransaction(m).setPaymentSessions(id)
      }
    })

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

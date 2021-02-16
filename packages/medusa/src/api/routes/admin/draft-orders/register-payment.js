import {
  defaultFields as defaultOrderFields,
  defaultRelations as defaultOrderRelations,
} from "../orders/index"

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const orderService = req.scope.resolve("orderService")

    const createdOrder = await draftOrderService.registerSystemPayment(id)

    const order = await orderService.retrieve(createdOrder.id, {
      relations: defaultOrderRelations,
      select: defaultOrderFields,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}

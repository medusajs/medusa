import {
  defaultRelations,
  defaultFields,
  defaultCartRelations,
  defaultCartFields,
} from "."

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")

    const draftOrder = await draftOrderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
      relations: defaultCartRelations,
      select: defaultCartFields,
    })

    res.json({ draft_order: draftOrder })
  } catch (error) {
    throw error
  }
}

import { defaultFields, defaultRelations } from "."

export default async (req, res) => {
  const { cart_id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const order = await orderService.retrieveByCartId(cart_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}

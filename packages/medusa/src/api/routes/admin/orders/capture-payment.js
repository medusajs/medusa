import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")

    await orderService.capturePayment(id)

    const order = await orderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ order })
  } catch (error) {
    throw error
  }
}

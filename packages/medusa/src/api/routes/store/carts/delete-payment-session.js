import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id, provider_id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    await cartService.deletePaymentSession(id, provider_id)
    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}

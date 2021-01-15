import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { id } = req.params

  try {
    const giftCardService = req.scope.resolve("giftCardService")
    const giftCard = await giftCardService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ gift_card: giftCard })
  } catch (err) {
    throw err
  }
}

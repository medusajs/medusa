import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  try {
    const selector = {}

    const giftCardService = req.scope.resolve("giftCardService")

    const giftCards = await giftCardService.list(selector, {
      select: defaultFields,
      relations: defaultRelations,
      order: { created_at: "DESC" },
    })

    res.status(200).json({ gift_cards: giftCards })
  } catch (err) {
    throw err
  }
}

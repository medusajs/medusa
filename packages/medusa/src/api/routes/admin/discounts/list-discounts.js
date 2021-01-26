import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  try {
    const selector = {}

    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const discountService = req.scope.resolve("discountService")

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    const discounts = await discountService.list(selector, listConfig)

    res.status(200).json({ discounts })
  } catch (err) {
    throw err
  }
}

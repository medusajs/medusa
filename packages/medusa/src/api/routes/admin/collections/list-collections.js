import { defaultFields, defaultRelations } from "."

export default async (req, res) => {
  try {
    const selector = {}

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    const collections = await productCollectionService.list(
      selector,
      listConfig
    )

    res.status(200).json({ collections })
  } catch (err) {
    throw err
  }
}

import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { discount_id } = req.params
  try {
    const discountService = req.scope.resolve("discountService")
    const data = await discountService.retrieve(discount_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ discount: data })
  } catch (err) {
    throw err
  }
}

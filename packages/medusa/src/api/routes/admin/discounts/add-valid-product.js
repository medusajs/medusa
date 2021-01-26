import { defaultFields, defaultRelations } from "./"

export default async (req, res) => {
  const { discount_id, variant_id } = req.params

  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.addValidProduct(discount_id, variant_id)

    const discount = await discountService.retrieve(discount_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}

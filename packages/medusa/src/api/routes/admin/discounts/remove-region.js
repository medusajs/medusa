export default async (req, res) => {
  const { discount_id, region_id } = req.params

  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.removeRegion(discount_id, region_id)

    const data = discountService.retrieve(discount_id)
    res.status(200).json({ discounts: data })
  } catch (err) {
    throw err
  }
}

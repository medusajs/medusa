export default async (req, res) => {
  const { discount_id, region_id } = req.params

  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.removeRegion(discount_id, region_id)
    const discount = await discountService.retrieve(discount_id, [
      "discount_rule",
      "discount_rule.valid_for",
      "regions",
    ])

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}

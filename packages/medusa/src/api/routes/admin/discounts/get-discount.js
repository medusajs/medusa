export default async (req, res) => {
  const { discount_id } = req.params
  try {
    const discountService = req.scope.resolve("discountService")
    const data = await discountService.retrieve(discount_id, [
      "discount_rule",
      "discount_rule.valid_for",
      "regions",
    ])

    res.status(200).json({ discount: data })
  } catch (err) {
    throw err
  }
}

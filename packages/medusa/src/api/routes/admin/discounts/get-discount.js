export default async (req, res) => {
  const { discount_id } = req.params
  try {
    const discountService = req.scope.resolve("discountService")
    const data = await discountService.retrieve(discount_id)

    const discount = await discountService.decorate(
      data,
      [
        "code",
        "is_dynamic",
        "discount_rule",
        "usage_count",
        "disabled",
        "starts_at",
        "ends_at",
        "regions",
      ],
      ["valid_for"]
    )

    res.status(200).json({ discount })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  try {
    const selector = {}

    const discountService = req.scope.resolve("discountService")

    if ("is_giftcard" in req.query) {
      selector.is_giftcard = req.query.is_giftcard === "true"
    }

    let expandFields = []
    if ("expand_fields" in req.query) {
      expandFields = req.query.expand_fields.split(",")
    }

    let includeFields = [
      "usage_count",
      "starts_at",
      "ends_at",
      "original_amount",
      "created",
    ]
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
    }

    const raw = await discountService.list(selector)

    const data = await Promise.all(
      raw.map(d => discountService.decorate(d, includeFields, expandFields))
    )

    res.status(200).json({ discounts: data })
  } catch (err) {
    throw err
  }
}

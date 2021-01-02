export default async (req, res) => {
  try {
    const selector = {}

    const discountService = req.scope.resolve("discountService")

    // let expandFields = []
    // if ("expand_fields" in req.query) {
    //   expandFields = req.query.expand_fields.split(",")
    // }

    // let includeFields = [
    //   "usage_count",
    //   "starts_at",
    //   "ends_at",
    //   "original_amount",
    //   "created",
    // ]
    // if ("fields" in req.query) {
    //   includeFields = req.query.fields.split(",")
    // }

    const discounts = await discountService.list(selector)

    res.status(200).json({ discounts })
  } catch (err) {
    throw err
  }
}

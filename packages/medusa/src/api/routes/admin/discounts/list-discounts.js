export default async (req, res) => {
  try {
    const selector = {}

    const discountService = req.scope.resolve("discountService")

    const discounts = await discountService.list(selector)

    res.status(200).json({ discounts })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  const { discount_id } = req.params
  try {
    const discountService = req.scope.resolve("discountService")
    const data = await discountService.retrieve(discount_id)

    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

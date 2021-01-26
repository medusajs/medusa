export default async (req, res) => {
  const { discount_id } = req.params

  try {
    const discountService = req.scope.resolve("discountService")
    await discountService.delete(discount_id)

    res.json({
      id: discount_id,
      object: "discount",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

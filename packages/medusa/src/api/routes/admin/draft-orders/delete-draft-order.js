export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    await draftOrderService.delete(id)
    res.json({
      id,
      object: "draft-order",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

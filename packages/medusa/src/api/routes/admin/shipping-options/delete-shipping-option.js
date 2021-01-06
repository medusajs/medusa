export default async (req, res) => {
  const { option_id } = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")

    await optionService.delete(option_id)

    res.json({
      id: option_id,
      object: "shipping-option",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

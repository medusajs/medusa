export default async (req, res) => {
  const { option_id } = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const data = await optionService.retrieve(option_id)

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}

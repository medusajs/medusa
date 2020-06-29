export default async (req, res) => {
  const { optionId } = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const data = await optionService.list()

    res.status(200).json({ shipping_options: data })
  } catch (err) {
    throw err
  }
}

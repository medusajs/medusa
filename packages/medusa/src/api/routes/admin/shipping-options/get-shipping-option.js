export default async (req, res) => {
  const { optionId } = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const data = await optionService.retrieve(optionId)

    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}

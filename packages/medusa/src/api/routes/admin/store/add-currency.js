export default async (req, res) => {
  const { currency_code } = req.params

  try {
    const storeService = req.scope.resolve("storeService")
    const data = await storeService.addCurrency(currency_code)
    res.status(200).json({ store: data })
  } catch (err) {
    throw err
  }
}

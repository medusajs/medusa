export default async (req, res) => {
  try {
    const storeService = req.scope.resolve("storeService")
    const data = await storeService.retrieve()
    res.status(200).json({ store: data })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  const { id, key } = req.params

  try {
    const regionService = req.scope.resolve("regionService")
    const region = await regionService.deleteMetadata(id, key)

    res.status(200).json({ region })
  } catch (err) {
    throw err
  }
}

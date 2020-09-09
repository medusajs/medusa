export default async (req, res) => {
  const { id } = req.params

  try {
    const addOnService = req.scope.resolve("addOnService")
    const addOn = await addOnService.retrieve(id)
    res.json({ add_on: addOn })
  } catch (err) {
    throw err
  }
}

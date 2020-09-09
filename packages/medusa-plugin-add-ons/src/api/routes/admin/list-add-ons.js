export default async (req, res) => {
  try {
    const addOnService = req.scope.resolve("addOnService")
    const addOns = await addOnService.list({})

    res.status(200).json({ add_ons: addOns })
  } catch (err) {
    throw err
  }
}

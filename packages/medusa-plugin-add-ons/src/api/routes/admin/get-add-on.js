export default async (req, res) => {
  const { id } = req.params

  try {
    const addOnService = req.scope.resolve("addOnService")
    let addOn = await addOnService.retrieve(id)
    addOn = await addOnService.decorate(
      addOn,
      ["name", "valid_for", "prices"],
      ["valid_for"]
    )

    res.json({ add_on: addOn })
  } catch (err) {
    throw err
  }
}

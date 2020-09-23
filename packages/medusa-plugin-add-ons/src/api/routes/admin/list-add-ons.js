export default async (req, res) => {
  try {
    const addOnService = req.scope.resolve("addOnService")
    let addOns = await addOnService.list({})
    addOns = await Promise.all(
      addOns.map((ao) =>
        addOnService.decorate(
          ao,
          ["name", "valid_for", "prices"],
          ["valid_for"]
        )
      )
    )

    res.status(200).json({ add_ons: addOns })
  } catch (err) {
    console.log(err)
    throw err
  }
}

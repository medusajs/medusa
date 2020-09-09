export default async (req, res) => {
  const { id } = req.params

  const addOnService = req.scope.resolve("addOnService")
  try {
    await addOnService.delete(id)

    res.status(200).send({
      id,
      object: "addOn",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}

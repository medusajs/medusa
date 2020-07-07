export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.retrieve(id)
    res.json({ customer })
  } catch (err) {
    throw err
  }
}

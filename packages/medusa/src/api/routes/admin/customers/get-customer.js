export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(id, {
      relations: ["orders"],
    })

    res.json({ customer })
  } catch (err) {
    throw err
  }
}

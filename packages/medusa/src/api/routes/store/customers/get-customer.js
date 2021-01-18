export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(id, {
      relations: ["orders", "shipping_addresses"],
    })
    res.json({ customer })
  } catch (err) {
    throw err
  }
}

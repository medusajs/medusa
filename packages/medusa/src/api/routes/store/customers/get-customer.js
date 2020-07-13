export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.retrieve(id)
    customer = customerService.decorate(
      customer._id,
      ["email", "first_name", "last_name", "shipping_addresses"],
      ["orders"]
    )
    res.json({ customer })
  } catch (err) {
    throw err
  }
}

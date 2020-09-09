export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.retrieve(id)
    customer = customerService.decorate(
      customer,
      ["email", "first_name", "last_name", "shipping_addresses", "phone"],
      ["orders"]
    )
    res.json({ customer })
  } catch (err) {
    throw err
  }
}

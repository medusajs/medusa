export default async (req, res) => {
  const { id, address_id } = req.params

  const customerService = req.scope.resolve("customerService")
  try {
    const customer = await customerService.removeAddress(id, address_id)
    const data = await customerService.decorate(
      customer,
      ["email", "first_name", "last_name", "shipping_addresses"],
      ["orders"]
    )
    res.json({ customer: data })
  } catch (err) {
    throw err
  }
}

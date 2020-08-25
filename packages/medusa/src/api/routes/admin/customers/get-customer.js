export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.retrieve(id)
    customer = await customerService.decorate(
      customer,
      ["email", "payment_methods", "has_account", "shipping_addresses"],
      ["orders"]
    )

    res.json({ customer })
  } catch (err) {
    throw err
  }
}

export default async (req, res) => {
  const { id, address_id } = req.params

  const customerService = req.scope.resolve("customerService")
  try {
    let customer = await customerService.removeAddress(id, address_id)

    customer = await customerService.retrieve(id, {
      relations: ["orders", "shipping_addresses"],
    })

    res.json({ customer: data })
  } catch (err) {
    throw err
  }
}

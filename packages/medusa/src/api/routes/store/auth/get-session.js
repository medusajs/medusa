export default async (req, res) => {
  try {
    if (req.user && req.user.customer_id) {
      const customerService = req.scope.resolve("customerService")
      const customer = await customerService.retrieve(req.user.customer_id)

      const data = await customerService.decorate(
        customer,
        [
          "_id",
          "email",
          "orders",
          "shipping_addresses",
          "first_name",
          "last_name",
        ],
        ["orders"]
      )
      res.json({ customer: data })
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    throw err
  }
}

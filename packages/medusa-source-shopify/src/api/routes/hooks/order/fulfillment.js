export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const order = req.body

  console.log(order)

  //TODO: update fulfillment

  res.sendStatus(200)
}

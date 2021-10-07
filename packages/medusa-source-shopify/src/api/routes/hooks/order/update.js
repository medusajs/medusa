export default async (req, res) => {
  // const shopifyService = req.scope.resolve("shopifyService")

  // //TODO: update payment
  // await shopifyService.updateOrder(req.body)

  console.log(req.body.line_items)

  res.sendStatus(200)
}

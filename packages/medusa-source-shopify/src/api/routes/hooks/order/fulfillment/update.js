export default async (req, res) => {
  const fulfillmentService = req.scope.resolve("shopifyFulfillmentService")

  await fulfillmentService.update(req.body)

  res.sendStatus(200)
}

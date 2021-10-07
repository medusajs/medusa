export default async (req, res) => {
  const fulfillmentService = req.scope.resolve("shopifyFulfillmentService")

  await fulfillmentService.create(req.body)

  res.sendStatus(200)
}

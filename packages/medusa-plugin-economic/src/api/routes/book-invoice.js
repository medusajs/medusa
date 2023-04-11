export default async (req, res) => {
  const economicService = req.scope.resolve("economicService")
  await economicService.bookEconomicInvoice(req.body.orderId)
  res.sendStatus(200)
}

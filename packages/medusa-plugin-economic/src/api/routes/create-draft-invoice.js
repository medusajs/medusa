export default async (req, res) => {
  const economicService = req.scope.resolve("economicService")
  await economicService.draftEconomicInvoice(req.body.orderId)
  res.sendStatus(200)
}

export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")
  await orderService.delete(req.body.id)
  res.sendStatus(200)
}

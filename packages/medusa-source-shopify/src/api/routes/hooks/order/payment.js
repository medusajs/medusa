export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  //TODO: update payment

  res.sendStatus(200)
}

export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  //TODO: update payment

  console.log(req.body)

  res.sendStatus(200)
}

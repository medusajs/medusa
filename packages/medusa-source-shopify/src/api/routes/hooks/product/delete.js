export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const id = req.body.id

  await shopifyService.withTransaction().deleteProduct(id)

  res.sendStatus(200)
}

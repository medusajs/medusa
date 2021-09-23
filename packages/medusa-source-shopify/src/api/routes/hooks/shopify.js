export default async (req, res) => {
  // TODO: implement verify webhook
  //   const verified = verifyWebhook(req.headers["X-Shopify-Hmac-SHA256"])
  //   if (!verified) {
  //     res.status(401).end()
  //   }

  const shopifyService = req.scope.resolve("shopifyService")

  const order = req.body

  const new_order = await shopifyService.createOrder(order)

  res.sendStatus(200)
}

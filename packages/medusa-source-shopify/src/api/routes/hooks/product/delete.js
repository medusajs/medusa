export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  /**
   * This does not work as product/delete only returns a Product ID.
   * Possible solution is to add external_id to products in Medusa.
   */
  const productHandle = req.body.handle
  await shopifyService.withTransaction().deleteProduct(productHandle)

  res.sendStatus(200)
}

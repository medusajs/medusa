import { fetchProduct } from "../../../../utils/fetch-shopify"

export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const productId = `${req.body.id}`

  await shopifyService.withTransaction().createProduct(productId)

  res.sendStatus(200)
}

export default async (container, options) => {
  try {
    const shopifyService = container.resolve("shopifyService")
    await shopifyService.importShopify()
  } catch (err) {
    console.log(err)
  }
}

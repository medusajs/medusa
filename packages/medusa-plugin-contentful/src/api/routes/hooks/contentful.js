export default async (req, res) => {
  try {
    const contentfulService = req.scope.resolve("contentfulService")

    const contentfulType = req.body.sys.contentType.sys.id
    const entryId = req.body.sys.id

    let updated = {}
    switch (contentfulType) {
      case "product":
        updated = await contentfulService.sendContentfulProductToAdmin(entryId)
        break
      case "productVariant":
        updated = await contentfulService.sendContentfulProductVariantToAdmin(
          entryId
        )
        break
      default:
        break
    }

    res.status(200).send(updated)
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}

export default async (req, res) => {
  try {
    const strapiService = req.scope.resolve("strapiService")

    const strapiType = req.body.sys.contentType.sys.id
    const entryId = req.body.sys.id

    let updated = {}
    switch (strapiType) {
      case "product":
        updated = await strapiService.sendStrapiProductToAdmin(entryId)
        break
      case "productVariant":
        updated = await strapiService.sendStrapiProductVariantToAdmin(entryId)
        break
      default:
        break
    }

    res.status(200).send(updated)
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}

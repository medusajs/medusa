export default async (req, res) => {
  try {
    const strapiService = req.scope.resolve("strapiService")

    // find Strapi entry type from body of webhook
    const strapiType = null
    // get the ID
    const entryId = ""

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

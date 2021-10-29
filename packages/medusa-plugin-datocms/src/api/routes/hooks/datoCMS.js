export default async (req, res) => {
  try {
    const datoCMSService = req.scope.resolve("datoCMSService")

    const datoCMSType = req.body.sys.contentType.sys.id

    const entryId = req.body.sys.id

    let updated = {}
    switch (datoCMSType) {
      case "product":
        updated = await datoCMSService.sendContentfulProductToAdmin(entryId)
        break
      case "productVariant":
        updated = await datoCMSService.sendContentfulProductVariantToAdmin(
          entryId
        )
        break
      case "region":
          updated = await datoCMSService.sendContentfulRegionToAdmin(
            entryId
          )
      default:
        break
    }

    res.status(200).send(updated)
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}

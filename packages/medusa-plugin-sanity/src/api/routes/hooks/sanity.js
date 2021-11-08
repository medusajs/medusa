export default async (req, res) => {
  try {
    const sanityService = req.scope.resolve("sanityService")

    //TODO: req sys in Sanity
    const sanityType = req.body.sys.contentType.sys.id
    const entryId = req.body.sys.id

    let updated = {}
    switch (sanityType) {
      case "product":
        updated = await sanityService.sendSanityProductToAdmin(entryId)
        break
      case "productVariant":
        updated = await sanityService.sendSanityProductVariantToAdmin(
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

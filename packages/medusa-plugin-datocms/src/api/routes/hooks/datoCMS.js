export default async (req, res) => {
  try {
    const datoCMSService = req.scope.resolve("datoCMSService")
    const eventType = req.body.event_type
    const entityId = req.body.entity.id
    const itemType = req.body.entity.relationships.item_type.data

    if (eventType !== "update") {
      throw new Error("Only update events are supported")
    }

    const model = await datoCMSService.getModel(itemType)

    if (!model) {
      throw new Error("No model found")
    }

    switch (model.api_key) {
      case "product":
        await contentfulService.updateProductFromDatoCMSToMedusa(entityId)
        break
      case "product_variant":
        await contentfulService.updateProductVariantFromDatoCMSToMedusa(entityId)
        break
      case "region":
        // TODO: update region in datocms
        break
      default:
        break
    }

    res.status(200).send('ok')
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}

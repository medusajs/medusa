export default async (req, res) => {
  const { variant_id } = req.params
  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )

    let sales_channel_id = req.body.sales_channel_id

    if (req.publishableApiKeyScopes?.sales_channel_ids.length === 1) {
      sales_channel_id = req.publishableApiKeyScopes.sales_channel_ids[0]
    }

    await restockNotificationService.addEmail(variant_id, req.body.email, sales_channel_id)
    res.sendStatus(201)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export default async (req, res) => {
  const { variant_id } = req.params
  try {
    const restockNotificationService = req.scope.resolve(
      "restockNotificationService"
    )
    await restockNotificationService.addEmail(variant_id, req.body.email)
    res.sendStatus(201)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

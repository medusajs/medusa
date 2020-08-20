export default async (req, res) => {
  const adyenService = req.scope.resolve("adyenService")

  const notification = req.body
  const event = notification.notificationItems[0].NotificationRequestItem

  const valid = adyenService.validateNotification(event)

  if (!valid) {
    res.status(401).send(`Unauthorized webhook event`)
    return
  }

  switch (event.success) {
    case "false":
      res.status(400).send("[accepted]")
      return
    default:
      res.status(200).send("[accepted]")
      return
  }
}

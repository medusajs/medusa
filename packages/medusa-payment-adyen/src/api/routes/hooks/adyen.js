export default async (req, res) => {
  const adyenService = req.scope.resolve("adyenService")

  const notification = req.body
  const event = notification.notificationItems[0].NotificationRequestItem

  const valid = adyenService.validateNotification(event)

  if (!valid) {
    res.status(401).send(`Unauthorized webhook event`)
    return
  }

  const eventBus = req.scope.resolve("eventBusService")
  eventBus.emit("adyen.notification_received", event)
  res.status(200).send("[accepted]")
}

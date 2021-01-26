export default async (req, res) => {
  const adyenService = req.scope.resolve("adyenService")
  const eventBus = req.scope.resolve("eventBusService")

  const notification = req.body
  const event = notification.notificationItems[0].NotificationRequestItem

  const valid = adyenService.validateNotification(event)

  if (!valid) {
    res.status(401).send(`Unauthorized webhook event`)
    return
  }

  eventBus.emit("adyen.notification_received", event)
  res.status(200).send("[accepted]")
}

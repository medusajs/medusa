export default async (req, res) => {
  const adyenService = req.scope.resolve("adyenService")

  const notification = req.body
  const event = notification.notificationItems[0].NotificationRequestItem

  const valid = adyenService.validateNotification(event)

  if (!valid) {
    res.status(401).send(`Unauthorized webhook event`)
    return
  }

  if (event.success === "true" && event.eventCode === "AUTHORISATION") {
    const orderService = req.scope.resolve("orderService")
    const cartService = req.scope.resolve("cartService")

    const cartId = event.additionalData["metadata.cart_id"]

    try {
      const order = await orderService.retrieveByCartId(cartId)
      console.log(order)
    } catch (error) {
      const cart = await cartService.retrieve(cartId)
      await orderService.createFromCart(cart)
    }

    // Create from cart
    res.status(200).send("[accepted]")
    return
  }

  if (event.success === "true" && event.eventCode === "CAPTURE") {
    // Create from cart
    console.log("Captured")
    res.status(200).send("[accepted]")
    return
  }

  res.status(200).send("[accepted]")
}

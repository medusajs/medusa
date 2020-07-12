export default async (req, res) => {
  try {
    const slackService = req.scope.resolve("slackService")

    await slackService.orderNotification("5eff28187fde3440fd15ab49")

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}

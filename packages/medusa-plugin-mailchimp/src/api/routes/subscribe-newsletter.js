export default async (req, res) => {
  const mailchimpService = req.scope.resolve("mailchimpService")
  await mailchimpService.subscribeNewsletter(
    req.body.email,
    req.body.data || {}
  )
  res.sendStatus(200)
}

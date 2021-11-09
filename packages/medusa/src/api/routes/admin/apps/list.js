export default async (req, res) => {
  const oauthService = req.scope.resolve("oauthService")
  const data = await oauthService.list({})

  res.status(200).json({ apps: data })
}

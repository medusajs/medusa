export default async (req, res) => {
  const { invite_id } = req.params
  const inviteService = req.scope.resolve("inviteService")

  await inviteService.resend(invite_id)

  res.sendStatus(200)
}

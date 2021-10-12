export default async (req, res) => {
  const { invite_id } = req.params

  const inviteService = req.scope.resolve("inviteService")
  await inviteService.delete(invite_id)

  res.status(200).send({
    id: invite_id,
    object: "invite",
    deleted: true,
  })
}

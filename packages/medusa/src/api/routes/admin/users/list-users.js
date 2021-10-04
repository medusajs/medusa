export default async (req, res) => {
  try {
    const userService = req.scope.resolve("userService")
    const users = await userService.list({})

    const inviteService = req.scope.resolve("inviteService")
    const invites = await inviteService.list({ accepted: false })

    const concat_res = users.concat(
      invites.map(invite => {
        return { ...invite, email: invite.user_email, isInvite: true }
      })
    )

    res.status(200).json({ users: concat_res })
  } catch (err) {
    throw err
  }
}

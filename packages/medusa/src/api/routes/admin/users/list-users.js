import { MedusaError, Validator } from "medusa-core-utils"
export default async (req, res) => {
  const schema = Validator.object().keys({
    includeInvites: Validator.boolean().optional(),
  })

  const { value, error } = schema.validate(req.query)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    let users = await userService.list({})

    if (value.includeInvites) {
      const inviteService = req.scope.resolve("inviteService")
      const invites = await inviteService.list({ accepted: false })

      users = users.concat(
        invites.map(invite => {
          return { ...invite, email: invite.user_email, isInvite: true }
        })
      )
    }

    res.status(200).json({ users })
  } catch (err) {
    throw err
  }
}

import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  try {
    const inviteService = req.scope.resolve("inviteService")
    const invites = await inviteService.list({ accepted: false })

    res.status(200).json({ invites })
  } catch (err) {
    throw err
  }
}

import { MedusaRequest, MedusaResponse } from "../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // req.session.auth_user = authUser
  // req.session.scope = authUser.scope
  req.session.auth_user = req.auth_user

  res.status(200).json({ user: req.auth_user })
}

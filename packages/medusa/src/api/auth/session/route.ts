import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  req.session.auth_user = req.auth

  res.status(200).json({ user: req.auth })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  req.session.destroy()
  res.json({ success: true })
}

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  req.session.auth_context = req.auth_context

  res.status(200).json({ user: req.auth_context })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  req.session.destroy()
  res.json({ success: true })
}

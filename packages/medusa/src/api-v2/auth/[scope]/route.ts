import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  req.session.destroy()
  res.sendStatus(200)
}

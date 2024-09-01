import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminResetPasswordReqType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminResetPasswordReqType>,
  res: MedusaResponse
) => {
  const { email } = req.validatedBody

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: { email },
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false

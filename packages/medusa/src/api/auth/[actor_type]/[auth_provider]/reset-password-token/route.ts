import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminResetPasswordTokenReqType } from "../../../../admin/users/validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminResetPasswordTokenReqType>,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params
  const { email } = req.validatedBody


  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: { entityId: email, provider: auth_provider }, 
    throwOnError: false // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false

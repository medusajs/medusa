import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params
  const { identifier } = req.body

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: {
      entityId: identifier,
      provider: auth_provider,
    },
    throwOnError: false, // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false

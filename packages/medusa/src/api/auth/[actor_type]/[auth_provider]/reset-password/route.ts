import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider, actor_type } = req.params

  const { entity_id } = req.body

  const payload = {
    entity_id,
    actor_type,
    provider: auth_provider,
  }

  await generateResetPasswordTokenWorkflow(req.scope).run({
    input: { payload },
    throwOnError: false, // we don't want to throw on error to avoid leaking information about non-existing identities
  })

  res.sendStatus(201)
}

export const AUTHENTICATE = false

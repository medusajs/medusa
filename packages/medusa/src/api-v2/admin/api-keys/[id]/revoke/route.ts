import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { RevokeApiKeyDTO } from "@medusajs/types"
import { revokeApiKeysWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id

  const { result, errors } = await revokeApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      revoke: {
        ...(req.validatedBody as Omit<RevokeApiKeyDTO, "id" | "revoked_by">),
        revoked_by: req.auth.actor_id,
      } as RevokeApiKeyDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ apiKey: result[0] })
}

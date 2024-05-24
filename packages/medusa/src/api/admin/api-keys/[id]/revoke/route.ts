import { revokeApiKeysWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminRevokeApiKeyType } from "../../validators"
import { refetchApiKey } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminRevokeApiKeyType>,
  res: MedusaResponse
) => {
  await revokeApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      revoke: {
        ...req.validatedBody,
        revoked_by: req.auth_context.actor_id,
      },
    },
  })

  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ api_key: apiKey })
}

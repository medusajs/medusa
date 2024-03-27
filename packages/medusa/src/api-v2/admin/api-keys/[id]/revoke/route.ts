import { revokeApiKeysWorkflow } from "@medusajs/core-flows"
import { RevokeApiKeyDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultAdminApiKeyFields } from "../../query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { errors } = await revokeApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      revoke: {
        ...(req.validatedBody as Omit<RevokeApiKeyDTO, "revoked_by">),
        revoked_by: req.auth.actor_id,
      } as RevokeApiKeyDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables: {
      id: req.params.id,
    },
    fields: defaultAdminApiKeyFields,
  })

  const [apiKey] = await remoteQuery(queryObject)

  res.status(200).json({ api_key: apiKey })
}

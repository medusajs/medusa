import {
  deleteApiKeysWorkflow,
  updateApiKeysWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { refetchApiKey } from "../helpers"
import { AdminUpdateApiKeyType } from "../validators"
import { MedusaError } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminApiKeyResponse>
) => {
  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!apiKey) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `API Key with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ api_key: apiKey })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateApiKeyType>,
  res: MedusaResponse<HttpTypes.AdminApiKeyResponse>
) => {
  await updateApiKeysWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ api_key: apiKey })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminApiKeyDeleteResponse>
) => {
  const id = req.params.id

  await deleteApiKeysWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "api_key",
    deleted: true,
  })
}

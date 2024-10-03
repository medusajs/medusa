import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/core-flows"
import { HttpTypes, LinkMethodRequest } from "@medusajs/framework/types"
import { ApiKeyType, MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchApiKey } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse<HttpTypes.AdminApiKeyResponse>
) => {
  const { add, remove } = req.validatedBody
  const apiKey = await refetchApiKey(req.params.id, req.scope, ["id", "type"])

  if (apiKey.type !== ApiKeyType.PUBLISHABLE) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Sales channels can only be associated with publishable API keys"
    )
  }

  await linkSalesChannelsToApiKeyWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      add,
      remove,
    },
  })

  const updatedApiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ api_key: updatedApiKey })
}

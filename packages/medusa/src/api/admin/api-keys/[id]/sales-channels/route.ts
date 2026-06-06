import { linkSalesChannelsToApiKeyWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { ApiKeyType, MedusaError } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchApiKey } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.SelectParams
  >,
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
    req.queryConfig.fields
  )

  res.status(200).json({ api_key: updatedApiKey })
}

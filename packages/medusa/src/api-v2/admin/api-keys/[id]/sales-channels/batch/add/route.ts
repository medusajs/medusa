import { addSalesChannelsToApiKeyWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminPostApiKeysApiKeySalesChannelsBatchReq } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const body = req.validatedBody as AdminPostApiKeysApiKeySalesChannelsBatchReq

  const apiKeyModule = req.scope.resolve(ModuleRegistrationName.API_KEY)

  const apiKey = await apiKeyModule.retrieve(req.params.id)

  if (apiKey.type !== "publishable") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Sales channels can only be associated with publishable API keys"
    )
  }

  const workflowInput = {
    data: [
      {
        api_key_id: req.params.id,
        sales_channel_ids: body.sales_channel_ids,
      },
    ],
  }

  const { errors } = await addSalesChannelsToApiKeyWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "api_key",
    fields: req.remoteQueryConfig.fields,
    variables: {
      id: req.params.id,
    },
  })

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [result] = await remoteQuery(query)

  res.status(200).json({ api_key: result })
}

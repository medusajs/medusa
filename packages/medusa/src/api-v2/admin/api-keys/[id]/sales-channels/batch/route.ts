import {
  addSalesChannelsToApiKeyWorkflow,
  removeSalesChannelsFromApiKeyWorkflow,
} from "@medusajs/core-flows"
import { ApiKeyType, MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminApiKeySalesChannelType } from "../../../validators"
import { BatchMethodRequest } from "@medusajs/types"
import { refetchApiKey } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<AdminApiKeySalesChannelType, AdminApiKeySalesChannelType>
  >,
  res: MedusaResponse
) => {
  const { create, delete: toDelete } = req.validatedBody
  const apiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (apiKey.type !== ApiKeyType.PUBLISHABLE) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Sales channels can only be associated with publishable API keys"
    )
  }

  if (create && create.length) {
    const workflowInput = {
      data: [
        {
          api_key_id: req.params.id,
          sales_channel_ids: create ?? [],
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
  }

  if (toDelete && toDelete.length) {
    const workflowInput = {
      data: [
        {
          api_key_id: req.params.id,
          sales_channel_ids: toDelete,
        },
      ],
    }

    const { errors } = await removeSalesChannelsFromApiKeyWorkflow(
      req.scope
    ).run({
      input: workflowInput,
      throwOnError: false,
    })

    if (Array.isArray(errors) && errors[0]) {
      throw errors[0].error
    }
  }

  const newApiKey = await refetchApiKey(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ api_key: newApiKey })
}

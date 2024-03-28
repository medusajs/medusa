import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  MedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminPostSalesChannelsChannelStockLocationsBatchReq } from "../../../../validators"
import { defaultAdminSalesChannelFields } from "../../../../query-config"
import { addLocationsToSalesChannelWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: MedusaRequest<AdminPostSalesChannelsChannelStockLocationsBatchReq>,
  res: MedusaResponse
) => {
  const workflowInput = {
    data: [
      {
        sales_channel_id: req.params.id,
        location_ids: req.validatedBody.location_ids,
      },
    ],
  }

  const { errors } = await addLocationsToSalesChannelWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables: { id: req.params.id },
    fields: req.remoteQueryConfig.fields,
  })

  const [sales_channel] = await remoteQuery(queryObject)

  res.status(200).json({ sales_channel })
}

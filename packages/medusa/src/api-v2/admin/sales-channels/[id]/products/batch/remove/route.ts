import { removeProductsFromSalesChannelsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { defaultAdminSalesChannelFields } from "../../../../query-config"
import { AdminPostSalesChannelsChannelProductsBatchReq } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const body =
    req.validatedBody as AdminPostSalesChannelsChannelProductsBatchReq

  const workflowInput = {
    data: [
      {
        sales_channel_id: req.params.id,
        product_ids: body.product_ids,
      },
    ],
  }

  const { errors } = await removeProductsFromSalesChannelsWorkflow(
    req.scope
  ).run({
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
    fields: defaultAdminSalesChannelFields,
  })

  const [sales_channel] = await remoteQuery(queryObject)

  res.status(200).json({ sales_channel })
}

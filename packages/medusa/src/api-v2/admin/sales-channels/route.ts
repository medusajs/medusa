import { createSalesChannelsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchSalesChannel } from "./helpers"
import {
  AdminCreateSalesChannelType,
  AdminGetSalesChannelsParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetSalesChannelsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: sales_channels, metadata } = await remoteQuery(queryObject)

  res.json({
    sales_channels,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateSalesChannelType>,
  res: MedusaResponse
) => {
  const salesChannelsData = [req.validatedBody]

  const { errors, result } = await createSalesChannelsWorkflow(req.scope).run({
    input: { salesChannelsData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const salesChannel = await refetchSalesChannel(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ sales_channel: salesChannel })
}

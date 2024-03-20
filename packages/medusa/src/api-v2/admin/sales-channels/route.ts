import { createSalesChannelsWorkflow } from "@medusajs/core-flows"
import { CreateSalesChannelDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = {
    filters: req.filterableFields,
    ...req.remoteQueryConfig.pagination,
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables,
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
  req: AuthenticatedMedusaRequest<CreateSalesChannelDTO>,
  res: MedusaResponse
) => {
  const salesChannelsData = [req.validatedBody]

  const { result, errors } = await createSalesChannelsWorkflow(req.scope).run({
    input: { salesChannelsData },
    throwOnError: false,
  })

  const salesChannel = result[0]

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables: { id: salesChannel.id },
    fields: req.remoteQueryConfig.fields,
  })

  const [sales_channel] = await remoteQuery(queryObject)

  res.status(200).json({ sales_channel })
}

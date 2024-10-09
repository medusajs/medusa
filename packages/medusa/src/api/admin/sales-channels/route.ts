import { createSalesChannelsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchSalesChannel } from "./helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminSalesChannelListParams>,
  res: MedusaResponse<HttpTypes.AdminSalesChannelListResponse>
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
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateSalesChannel>,
  res: MedusaResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const salesChannelsData = [req.validatedBody]

  const { result } = await createSalesChannelsWorkflow(req.scope).run({
    input: { salesChannelsData },
  })

  const salesChannel = await refetchSalesChannel(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ sales_channel: salesChannel })
}

import { createSalesChannelsWorkflow } from "@zjedene-medusa/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchSalesChannel } from "./helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminSalesChannelListParams>,
  res: MedusaResponse<HttpTypes.AdminSalesChannelListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
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
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateSalesChannel,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const salesChannelsData = [req.validatedBody]

  const { result } = await createSalesChannelsWorkflow(req.scope).run({
    input: { salesChannelsData },
  })

  const salesChannel = await refetchSalesChannel(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ sales_channel: salesChannel })
}

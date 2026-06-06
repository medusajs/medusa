import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { createCampaignsWorkflow } from "@zjedene-medusa/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import { refetchCampaign } from "./helpers"
import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetCampaignsParams>,
  res: MedusaResponse<HttpTypes.AdminCampaignListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "campaign",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: campaigns, metadata } = await remoteQuery(query)

  res.json({
    campaigns,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateCampaign & AdditionalData,
    HttpTypes.AdminGetCampaignParams
  >,
  res: MedusaResponse<HttpTypes.AdminCampaignResponse>
) => {
  const { additional_data, ...rest } = req.validatedBody
  const createCampaigns = createCampaignsWorkflow(req.scope)
  const campaignsData = [rest]

  const { result } = await createCampaigns.run({
    input: { campaignsData, additional_data },
    context: {
      requestId: req.requestId,
    },
  })

  const campaign = await refetchCampaign(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ campaign })
}

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createCampaignsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { AdminCreateCampaignType } from "./validators"
import { refetchCampaign } from "./helpers"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetCampaignParams>,
  res: MedusaResponse<HttpTypes.AdminCampaignListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "campaign",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
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
  req: AuthenticatedMedusaRequest<AdminCreateCampaignType & AdditionalData>,
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
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ campaign })
}

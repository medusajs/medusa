import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  deleteCampaignsWorkflow,
  updateCampaignsWorkflow,
} from "@medusajs/core-flows"

import { refetchCampaign } from "../helpers"
import { AdminUpdateCampaignType } from "../validators"
import { MedusaError } from "@medusajs/framework/utils"
import { AdditionalData, HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminCampaignResponse>
) => {
  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!campaign) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Campaign with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ campaign })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCampaignType & AdditionalData>,
  res: MedusaResponse<HttpTypes.AdminCampaignResponse>
) => {
  const existingCampaign = await refetchCampaign(req.params.id, req.scope, [
    "id",
  ])
  if (!existingCampaign) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Campaign with id "${req.params.id}" not found`
    )
  }

  const { additional_data, ...rest } = req.validatedBody
  const updateCampaigns = updateCampaignsWorkflow(req.scope)
  const campaignsData = [
    {
      id: req.params.id,
      ...rest,
    },
  ]

  await updateCampaigns.run({
    input: { campaignsData, additional_data },
  })

  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ campaign })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminCampaignDeleteResponse>
) => {
  const id = req.params.id
  const deleteCampaigns = deleteCampaignsWorkflow(req.scope)

  await deleteCampaigns.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "campaign",
    deleted: true,
  })
}

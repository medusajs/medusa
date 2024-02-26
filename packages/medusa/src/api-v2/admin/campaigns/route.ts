import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { CreateCampaignDTO, IPromotionModuleService } from "@medusajs/types"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createCampaignsWorkflow } from "@medusajs/core-flows"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const [campaigns, count] = await promotionModuleService.listAndCountCampaigns(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({
    count,
    campaigns,
    offset,
    limit,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateCampaignDTO>,
  res: MedusaResponse
) => {
  const createCampaigns = createCampaignsWorkflow(req.scope)
  const campaignsData = [req.validatedBody]

  const { result, errors } = await createCampaigns.run({
    input: { campaignsData },
    throwOnError: false,
    context: {
      requestId: req.requestId,
    },
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ campaign: result[0] })
}

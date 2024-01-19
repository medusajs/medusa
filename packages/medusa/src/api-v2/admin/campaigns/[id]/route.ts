import { updateCampaignsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const campaign = await promotionModuleService.retrieveCampaign(
    req.params.id,
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
    }
  )

  res.status(200).json({ campaign })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const updateCampaigns = updateCampaignsWorkflow(req.scope)
  const manager = req.scope.resolve("manager")
  const campaignsData = [
    {
      id: req.params.id,
      ...(req.validatedBody || {}),
    },
  ]

  const { result, errors } = await updateCampaigns.run({
    input: { campaignsData },
    context: { manager },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ campaign: result[0] })
}

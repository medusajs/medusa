import {
  deleteCampaignsWorkflow,
  updateCampaignsWorkflow,
} from "@medusajs/core-flows"
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
  const campaignsData = [
    {
      id: req.params.id,
      ...(req.validatedBody || {}),
    },
  ]

  const { result, errors } = await updateCampaigns.run({
    input: { campaignsData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ campaign: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id
  const manager = req.scope.resolve("manager")
  const deleteCampaigns = deleteCampaignsWorkflow(req.scope)

  const { errors } = await deleteCampaigns.run({
    input: { ids: [id] },
    context: { manager },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "campaign",
    deleted: true,
  })
}

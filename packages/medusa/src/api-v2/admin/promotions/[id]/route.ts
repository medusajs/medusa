import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deletePromotionsWorkflow,
  updatePromotionsWorkflow,
} from "@medusajs/core-flows"

import { AdminPostPromotionsPromotionReq } from "../validators"
import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { UpdateApplicationMethodDTO } from "@medusajs/types"
import { UpdatePromotionDTO } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const promotion = await promotionModuleService.retrieve(req.params.id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.status(200).json({ promotion })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPromotionsPromotionReq>,
  res: MedusaResponse
) => {
  const updatePromotions = updatePromotionsWorkflow(req.scope)
  const promotionsData = [
    {
      id: req.params.id,
      ...req.validatedBody,
    },
  ] as UpdatePromotionDTO[]

  const { result, errors } = await updatePromotions.run({
    input: { promotionsData },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ promotion: result[0] })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const manager = req.scope.resolve("manager")
  const deletePromotions = deletePromotionsWorkflow(req.scope)

  const { errors } = await deletePromotions.run({
    input: { ids: [id] },
    context: { manager },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "promotion",
    deleted: true,
  })
}

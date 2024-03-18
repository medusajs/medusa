import {
  deletePromotionsWorkflow,
  updatePromotionsWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService, UpdatePromotionDTO } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  AdminGetPromotionsParams,
  AdminPostPromotionsPromotionReq,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPromotionsParams>,
  res: MedusaResponse
) => {
  const idOrCode = req.params.id
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const [promotion] = await promotionModuleService.list(
    { $or: [{ id: idOrCode }, { code: idOrCode }] },
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
      take: 1,
    }
  )

  if (!promotion) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Promotion with id or code: does-not-exist was not found`
    )
  }

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
  const deletePromotions = deletePromotionsWorkflow(req.scope)

  const { errors } = await deletePromotions.run({
    input: { ids: [id] },
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

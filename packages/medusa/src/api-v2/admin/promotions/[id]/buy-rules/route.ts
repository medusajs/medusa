import { addRulesToPromotionsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { RuleType } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  defaultAdminPromotionFields,
  defaultAdminPromotionRelations,
} from "../../query-config"
import { AdminPostPromotionsPromotionRulesReq } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPromotionsPromotionRulesReq>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = addRulesToPromotionsWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: {
      rule_type: RuleType.BUY_RULES,
      data: {
        id: req.params.id,
        ...req.validatedBody,
      },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const promotionModuleService: IPromotionModuleService = req.scope.resolve(
    ModuleRegistrationName.PROMOTION
  )

  const promotion = await promotionModuleService.retrieve(id, {
    select: defaultAdminPromotionFields,
    relations: defaultAdminPromotionRelations,
  })

  res.status(200).json({ promotion })
}

import { updatePromotionRulesWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import {
  defaultAdminPromotionFields,
  defaultAdminPromotionRelations,
} from "../../../../query-config"
import { AdminPostBatchUpdateRules } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostBatchUpdateRules>,
  res: MedusaResponse
) => {
  const id = req.params.id
  const workflow = updatePromotionRulesWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { data: req.validatedBody.rules },
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

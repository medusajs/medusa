import { updatePromotionRulesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminUpdateBatchRulesType } from "../../../../validators"
import { refetchPromotion } from "../../../../helpers"
import { MedusaError } from "@medusajs/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateBatchRulesType>,
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

  const promotion = await refetchPromotion(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!promotion) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Promotion with id: ${id} was not found`
    )
  }

  res.status(200).json({ promotion })
}

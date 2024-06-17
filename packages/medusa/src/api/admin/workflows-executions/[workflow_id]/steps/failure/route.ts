import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { StepResponse } from "@medusajs/workflows-sdk"
import { TransactionHandlerType, isDefined } from "@medusajs/utils"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AdminCreateWorkflowsAsyncResponseType } from "../../../validators"
import { IWorkflowEngineService } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateWorkflowsAsyncResponseType>,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { workflow_id } = req.params

  const body = req.validatedBody

  const { transaction_id, step_id } = body

  const compensateInput = body.compensate_input
  const stepResponse = isDefined(body.response)
    ? new StepResponse(body.response, compensateInput)
    : undefined
  const stepAction = body.action || TransactionHandlerType.INVOKE

  await workflowEngineService.setStepFailure({
    idempotencyKey: {
      action: stepAction,
      transactionId: transaction_id,
      stepId: step_id,
      workflowId: workflow_id,
    },
    stepResponse,
    options: {
      container: req.scope,
      context: {
        requestId: req.requestId,
      },
    },
  })

  return res.status(200).json({ success: true })
}

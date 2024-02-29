import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { TransactionHandlerType, isDefined } from "@medusajs/utils"
import { IWorkflowEngineService, StepResponse } from "@medusajs/workflows-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { AdminPostWorkflowsAsyncResponseReq } from "./validators"

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { id: workflow_id } = req.params

  const body = req.validatedBody as AdminPostWorkflowsAsyncResponseReq

  const { transaction_id, step_id } = body

  const compensateInput = body.compensate_input
  const stepResponse = isDefined(body.response)
    ? new StepResponse(body.response, compensateInput)
    : undefined
  const stepAction = body.action || TransactionHandlerType.INVOKE

  await workflowEngineService.setStepSuccess({
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

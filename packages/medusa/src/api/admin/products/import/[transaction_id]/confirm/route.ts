import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"

import { IWorkflowEngineService } from "@medusajs/types"
import { ModuleRegistrationName, TransactionHandlerType } from "@medusajs/utils"
import {
  importProductsWorkflowId,
  waitConfirmationProductImportStepId,
} from "@medusajs/core-flows"
import { StepResponse } from "@medusajs/workflows-sdk"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )
  const transactionId = req.params.transaction_id

  await workflowEngineService.setStepSuccess({
    idempotencyKey: {
      action: TransactionHandlerType.INVOKE,
      transactionId,
      stepId: waitConfirmationProductImportStepId,
      workflowId: importProductsWorkflowId,
    },
    stepResponse: new StepResponse(true),
  })

  res.status(202).json({})
}

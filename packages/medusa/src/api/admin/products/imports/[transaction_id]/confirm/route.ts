import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import {
  importProductsAsChunksWorkflowId,
  waitConfirmationProductImportStepId,
} from "@zjedene-medusa/core-flows"
import { IWorkflowEngineService } from "@zjedene-medusa/framework/types"
import { Modules, TransactionHandlerType } from "@zjedene-medusa/framework/utils"
import { StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * @since 2.8.5
 */
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    Modules.WORKFLOW_ENGINE
  )
  const transactionId = req.params.transaction_id

  await workflowEngineService.setStepSuccess({
    idempotencyKey: {
      action: TransactionHandlerType.INVOKE,
      transactionId,
      stepId: waitConfirmationProductImportStepId,
      workflowId: importProductsAsChunksWorkflowId,
    },
    stepResponse: new StepResponse(true),
  })

  res.status(202).json({})
}

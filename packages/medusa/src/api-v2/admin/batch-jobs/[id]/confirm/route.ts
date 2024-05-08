import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { TransactionHandlerType } from "@medusajs/utils"
import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const workflowModule = req.scope.resolve<IWorkflowEngineService>(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const [workflow] = await workflowModule.listWorkflowExecution({
    transaction_id: id,
  })

  if (!workflow) {
    throw new Error(`No batch job found with id ${id}`)
  }

  const idempotencyKey = {
    workflowId: workflow.workflow_id,
    transactionId: id,
    stepId: "wait-for-confirmation",
    action: TransactionHandlerType.INVOKE,
  }

  await workflowModule.setStepSuccess({ idempotencyKey, stepResponse: {} })

  res.status(200).json({ success: true })
}

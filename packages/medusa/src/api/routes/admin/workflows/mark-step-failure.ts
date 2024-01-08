import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { IWorkflowOrchestratorModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
    req.scope.resolve(ModuleRegistrationName.WORKFLOW_ORCHESTRATOR)

  const { workflow_id, transaction_id, step_id } = req.params
  const stepResponse = req.body

  await workflowOrchestratorService.setStepFailure({
    idempotencyKey: {
      action: "invoke",
      transactionId: transaction_id,
      stepId: step_id,
      workflowId: workflow_id,
    },
    stepResponse,
    options: {
      container: req.scope,
    },
  })

  return res.send("ok")
}

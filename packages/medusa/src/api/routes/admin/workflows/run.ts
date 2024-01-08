import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import {
  IWorkflowOrchestratorModuleService,
  WorkflowOrchestratorRunDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
    req.scope.resolve(ModuleRegistrationName.WORKFLOW_ORCHESTRATOR)

  const { workflow_id } = req.params
  const options = req.body as WorkflowOrchestratorRunDTO

  const { acknowledgement } = await workflowOrchestratorService.run(
    workflow_id,
    options
  )

  return res.json(acknowledgement)
}

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  IWorkflowEngineService,
  WorkflowOrchestratorRunDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { AdminCreateWorkflowsRunType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateWorkflowsRunType>,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { workflow_id } = req.params

  const { transaction_id, input } = req.validatedBody

  const options = {
    transactionId: transaction_id,
    input,
    context: {
      requestId: req.requestId,
    },
  } as WorkflowOrchestratorRunDTO

  const { acknowledgement } = await workflowEngineService.run(
    workflow_id,
    options
  )

  return res.status(200).json({ acknowledgement })
}

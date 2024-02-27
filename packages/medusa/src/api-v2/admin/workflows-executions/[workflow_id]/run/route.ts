import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import {
  IWorkflowEngineService,
  WorkflowOrchestratorTypes,
} from "@medusajs/workflows-sdk"

import { AdminPostWorkflowsRunReq } from "../../validators"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostWorkflowsRunReq>,
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
    throwOnError: false,
  } as WorkflowOrchestratorTypes.WorkflowOrchestratorRunDTO

  const { acknowledgement } = await workflowEngineService.run(
    workflow_id,
    options
  )

  return res.status(200).json({ acknowledgement })
}

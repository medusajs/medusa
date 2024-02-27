import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IWorkflowEngineService,
  WorkflowOrchestratorTypes,
} from "@medusajs/workflows-sdk"

import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { AdminPostWorkflowsRunReq } from "./validators"

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { id: workflow_id } = req.params

  const { transaction_id, input } =
    req.validatedBody as AdminPostWorkflowsRunReq

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

import {
  HttpTypes,
  IWorkflowEngineService,
  WorkflowOrchestratorRunDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateWorkflowsRun>,
  res: MedusaResponse<HttpTypes.AdminWorkflowRunResponse>
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    Modules.WORKFLOW_ENGINE
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

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { workflow_id, transaction_id } = req.params

  const execution = await workflowEngineService.retrieveWorkflowExecution(
    {
      workflow_id,
      transaction_id,
    },
    {
      select: req.retrieveConfig.select,
      relations: req.retrieveConfig.relations,
    }
  )

  res.status(200).json({
    workflow_execution: execution,
  })
}

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const { id } = req.params

  const execution = await workflowEngineService.retrieveWorkflowExecution(id, {
    select: req.retrieveConfig.select,
    relations: req.retrieveConfig.relations,
  })

  res.status(200).json({
    workflow_execution: execution,
  })
}

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const listConfig = req.listConfig

  const [workflow_executions, count] =
    await workflowEngineService.listAndCountWorkflowExecution(
      req.filterableFields,
      {
        select: req.listConfig.select,
        relations: req.listConfig.relations,
        skip: listConfig.skip,
        take: listConfig.take,
      }
    )

  res.json({
    workflow_executions,
    count,
    offset: listConfig.skip,
    limit: listConfig.take,
  })
}

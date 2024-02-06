import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const listConfig = req.listConfig

  const { transaction_id, workflow_id } = req.filterableFields

  const transactionIds = Array.isArray(transaction_id)
    ? transaction_id
    : [transaction_id]
  const workflowIds = Array.isArray(workflow_id) ? workflow_id : [workflow_id]

  const filters = {}

  if (transaction_id) {
    filters["transaction_id"] = transactionIds
  }

  if (workflow_id) {
    filters["workflow_id"] = workflowIds
  }

  const [workflow_executions, count] =
    await workflowEngineService.listAndCountWorkflowExecution(filters, {
      select: req.listConfig.select,
      relations: req.listConfig.relations,
      skip: listConfig.skip,
      take: listConfig.take,
    })

  res.json({
    workflow_executions,
    count,
    offset: listConfig.skip,
    limit: listConfig.take,
  })
}

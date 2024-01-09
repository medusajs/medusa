import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { IWorkflowOrchestratorModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IsOptional } from "class-validator"
import { IsType } from "../../../../utils"
import { extendedFindParamsMixin } from "../../../../types/common"

export default async function (req: MedusaRequest, res: MedusaResponse) {
  const workflowOrchestratorService: IWorkflowOrchestratorModuleService =
    req.scope.resolve(ModuleRegistrationName.WORKFLOW_ORCHESTRATOR)

  const listConfig = req.listConfig
  // TODO: fix array of values
  const { transaction_id, workflow_id } = req.filterableFields

  const transactionIds = Array.isArray(transaction_id)
    ? transaction_id
    : [transaction_id]
  const workflowIds = Array.isArray(workflow_id) ? workflow_id : [workflow_id]

  const filters = {}

  if (transaction_id) {
    filters["transaction_id"] = transaction_id
  }

  if (workflow_id) {
    filters["workflow_id"] = workflow_id
  }

  const [workflow_executions, count] =
    await workflowOrchestratorService.listAndCountWorkflowExecution(filters, {
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

export class AdminGetWorkflowsParams extends extendedFindParamsMixin() {
  /**
   * transaction id(s) to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  transaction_id?: string | string[]

  /**
   * workflow id(s) to filter product variants by.
   */
  @IsOptional()
  @IsType([String, [String]])
  workflow_id?: string | string[]
}

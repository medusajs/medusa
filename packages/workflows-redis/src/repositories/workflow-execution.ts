import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { WorkflowOrchestratorTypes } from "@medusajs/workflows-sdk"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { WorkflowExecution } from "@models"

// eslint-disable-next-line max-len
export class WorkflowExecutionRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  WorkflowExecution
) {
  async upsert(
    data: WorkflowOrchestratorTypes.UpsertWorkflowExecutionDTO[],
    context: Context = {}
  ): Promise<WorkflowExecution[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const executions = data.map((executionIds) => {
      return manager.create(WorkflowExecution, executionIds)
    })

    return await manager.upsertMany(executions)
  }
}

import { Context, DAL, WorkflowOrchestratorTypes } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { WorkflowExecution } from "@models"

// eslint-disable-next-line max-len
export class WorkflowExecutionRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<WorkflowExecution> = { where: {} },
    context: Context = {}
  ): Promise<WorkflowExecution[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      WorkflowExecution,
      findOptions_.where as MikroFilterQuery<WorkflowExecution>,
      findOptions_.options as MikroOptions<WorkflowExecution>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<WorkflowExecution> = { where: {} },
    context: Context = {}
  ): Promise<[WorkflowExecution[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      WorkflowExecution,
      findOptions_.where as MikroFilterQuery<WorkflowExecution>,
      findOptions_.options as MikroOptions<WorkflowExecution>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(WorkflowExecution, { id: { $in: ids } }, {})
  }

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

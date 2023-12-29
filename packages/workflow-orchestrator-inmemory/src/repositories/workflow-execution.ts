import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError } from "@medusajs/utils"
import {
  LoadStrategy,
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { WorkflowExecution } from "@models"
import { UpsertWorkflowExecutionDTO } from "../types"

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

  async create(
    data: UpsertWorkflowExecutionDTO[],
    context: Context = {}
  ): Promise<WorkflowExecution[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const WorkflowOrchestrators = data.map((workflowOrchestratorData) => {
      return manager.create(WorkflowExecution, workflowOrchestratorData)
    })

    manager.persist(WorkflowOrchestrators)

    return WorkflowOrchestrators
  }

  async update(
    data: UpsertWorkflowExecutionDTO[],
    context: Context = {}
  ): Promise<WorkflowExecution[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const existingWorkflowExecutions = await this.find(
      {
        where: {
          workflow_id: {
            $in: data.map(
              (workflowExecutionData) => workflowExecutionData.workflow_id
            ),
          },
          transaction_id: {
            $in: data.map(
              (workflowExecutionData) => workflowExecutionData.transaction_id
            ),
          },
        },
      },
      context
    )

    const existingWorkflowExecutionMap = new Map(
      existingWorkflowExecutions.map<[string, WorkflowExecution]>(
        (WorkflowExecution) => [
          WorkflowExecution.workflow_id +
            "_" +
            WorkflowExecution.transaction_id,
          WorkflowExecution,
        ]
      )
    )

    const workflowExecutions = data.map((workflowExecutionData) => {
      const existingWorkflowExecution = existingWorkflowExecutionMap.get(
        workflowExecutionData.workflow_id +
          "_" +
          workflowExecutionData.transaction_id
      )

      if (!existingWorkflowExecution) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `WorkflowExecution with workflow_id "${workflowExecutionData.workflow_id}" and transaction_id "${workflowExecutionData.transaction_id}" was not found`
        )
      }

      return manager.assign(existingWorkflowExecution, workflowExecutionData)
    })

    manager.persist(workflowExecutions)

    return workflowExecutions
  }
}

import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { WorkflowOrchestratorTypes } from "@medusajs/workflows-sdk"
import { WorkflowExecution } from "@models"
import { WorkflowExecutionRepository } from "@repositories"

type InjectedDependencies = {
  workflowExecutionRepository: DAL.RepositoryService
}

export class WorkflowExecutionService<
  TEntity extends WorkflowExecution = WorkflowExecution
> {
  protected readonly workflowExecutionRepository_: DAL.RepositoryService

  constructor({ workflowExecutionRepository }: InjectedDependencies) {
    this.workflowExecutionRepository_ = workflowExecutionRepository
  }

  @InjectManager("workflowExecutionRepository_")
  async retrieve(
    workflowExecutionId: string,
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      WorkflowExecution,
      WorkflowOrchestratorTypes.WorkflowExecutionDTO
    >({
      id: workflowExecutionId,
      entityName: WorkflowExecution.name,
      repository: this.workflowExecutionRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("workflowExecutionRepository_")
  async list(
    filters: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<WorkflowExecution>(
      filters,
      config
    )

    return (await this.workflowExecutionRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("workflowExecutionRepository_")
  async listAndCount(
    filters: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<WorkflowExecution>(
      filters,
      config
    )

    return (await this.workflowExecutionRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("workflowExecutionRepository_")
  async upsert(
    data: WorkflowOrchestratorTypes.UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.workflowExecutionRepository_ as WorkflowExecutionRepository
    ).upsert(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("workflowExecutionRepository_")
  async delete(
    idsOrPKs: string[] | object[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.workflowExecutionRepository_.delete(idsOrPKs, sharedContext)
  }
}

import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { WorkflowOrchestratorTypes } from "@medusajs/workflows-sdk"
import { WorkflowExecution } from "@models"

type InjectedDependencies = {
  workflowExecutionRepository: DAL.RepositoryService
}

export class WorkflowExecutionService<
  TEntity extends WorkflowExecution = WorkflowExecution
> extends ModulesSdkUtils.abstractServiceFactory<InjectedDependencies, {}>(
  WorkflowExecution
)<TEntity> {
  protected workflowExecutionRepository_: DAL.RepositoryService<TEntity>

  constructor({ workflowExecutionRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.workflowExecutionRepository_ = workflowExecutionRepository
  }

  @InjectTransactionManager("workflowExecutionRepository_")
  async upsert(
    data: WorkflowOrchestratorTypes.UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.workflowExecutionRepository_.upsert!(data, sharedContext)
  }
}

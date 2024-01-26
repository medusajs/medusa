import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
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
}

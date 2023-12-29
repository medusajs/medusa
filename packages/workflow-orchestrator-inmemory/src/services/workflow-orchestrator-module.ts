import {
  Context,
  DAL,
  FilterableWorkflowExecutionProps,
  FindConfig,
  IWorkflowOrchestratorModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { WorkflowExecutionService } from "@services"
import { joinerConfig } from "../joiner-config"
import { UpsertWorkflowExecutionDTO, WorkflowExecutionDTO } from "../types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  workflowExecutionService: WorkflowExecutionService
}

export default class WorkflowOrchestratorModuleService
  implements IWorkflowOrchestratorModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: WorkflowExecutionService

  constructor(
    { baseRepository, workflowExecutionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.workflowExecutionService_ = workflowExecutionService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async listWorkflowExecution(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowExecutionDTO[]> {
    const wfExecutions = await this.workflowExecutionService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<WorkflowExecutionDTO[]>(
      wfExecutions,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountWorkflowExecution(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[WorkflowExecutionDTO[], number]> {
    const [wfExecutions, count] =
      await this.workflowExecutionService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize<WorkflowExecutionDTO[]>(
        wfExecutions,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectManager("baseRepository_")
  async createWorkflowExecution(
    data: UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowExecutionDTO[]> {
    const workflows = await this.createWorkflowExecution_(data, sharedContext)

    return await this.listWorkflowExecution(
      { id: workflows.map((p) => p!.id) },
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async createWorkflowExecution_(
    data: UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const createdWorkflows = await this.workflowExecutionService_.create(
      data,
      sharedContext
    )

    return createdWorkflows
  }

  @InjectManager("baseRepository_")
  async updateWorkflowExecution(
    data: UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowExecutionDTO[]> {
    const workflows = await this.updateWorkflowExecution_(data, sharedContext)

    return await this.listWorkflowExecution(
      { id: workflows.map((p) => p!.id) },
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateWorkflowExecution_(
    data: UpsertWorkflowExecutionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const updatedWorkflows = await this.workflowExecutionService_.update(
      data,
      sharedContext
    )

    return updatedWorkflows
  }

  @InjectManager("baseRepository_")
  async deleteWorkflowExecution(
    executionIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.workflowExecutionService_.delete(
      executionIds,
      sharedContext
    )
  }
}

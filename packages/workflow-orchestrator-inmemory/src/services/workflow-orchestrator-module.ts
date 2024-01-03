import {
  Context,
  DAL,
  FilterableWorkflowExecutionProps,
  FindConfig,
  IWorkflowOrchestratorModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  WorkflowOrchestratorTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectSharedContext,
  MedusaContext,
} from "@medusajs/utils"
import {
  WorkflowExecutionService,
  WorkflowOrchestratorService,
} from "@services"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  workflowExecutionService: WorkflowExecutionService
  workflowOrchestratorService: WorkflowOrchestratorService
}

export class WorkflowOrchestratorModuleService
  implements IWorkflowOrchestratorModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: WorkflowExecutionService
  protected workflowOrchestratorService_: WorkflowOrchestratorService

  constructor(
    {
      baseRepository,
      workflowExecutionService,
      workflowOrchestratorService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.workflowExecutionService_ = workflowExecutionService
    this.workflowOrchestratorService_ = workflowOrchestratorService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async listWorkflowExecution(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO[]> {
    const wfExecutions = await this.workflowExecutionService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<
      WorkflowOrchestratorTypes.WorkflowExecutionDTO[]
    >(wfExecutions, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountWorkflowExecution(
    filters: FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[WorkflowOrchestratorTypes.WorkflowExecutionDTO[], number]> {
    const [wfExecutions, count] =
      await this.workflowExecutionService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize<
        WorkflowOrchestratorTypes.WorkflowExecutionDTO[]
      >(wfExecutions, {
        populate: true,
      }),
      count,
    ]
  }

  @InjectSharedContext()
  async run(workflowId: string, context: Context = {}) {
    const ret = await this.workflowOrchestratorService_.run(workflowId, context)

    return ret as any
  }

  @InjectSharedContext()
  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    context: Context = {}
  ) {
    return this.workflowOrchestratorService_.getRunningTransaction(
      workflowId,
      transactionId,
      context
    )
  }

  @InjectSharedContext()
  async setStepSuccess(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    context: Context = {}
  ) {
    return this.workflowOrchestratorService_.setStepSuccess(
      {
        idempotencyKey,
        stepResponse,
        options,
      } as any,
      context
    )
  }

  @InjectSharedContext()
  async setStepFailure(
    {
      idempotencyKey,
      stepResponse,
      options,
    }: {
      idempotencyKey: string | object
      stepResponse: unknown
      options?: Record<string, any>
    },
    context: Context = {}
  ) {
    return this.workflowOrchestratorService_.setStepFailure(
      {
        idempotencyKey,
        stepResponse,
        options,
      } as any,
      context
    )
  }

  @InjectSharedContext()
  async subscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriber: Function
      subscriberId?: string
    },
    context: Context = {}
  ) {
    return this.workflowOrchestratorService_.subscribe(args as any, context)
  }

  @InjectSharedContext()
  async unsubscribe(
    args: {
      workflowId: string
      transactionId?: string
      subscriberOrId: string | Function
    },
    context: Context = {}
  ) {
    return this.workflowOrchestratorService_.unsubscribe(args as any, context)
  }
}

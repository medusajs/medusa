import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectSharedContext,
  MedusaContext,
} from "@medusajs/utils"
import type {
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
  WorkflowOrchestratorTypes,
} from "@medusajs/workflows-sdk"
import {WorkflowOrchestratorService} from "@services"
import {joinerConfig} from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>
  workflowOrchestratorService: WorkflowOrchestratorService
}

export class WorkflowsModuleService
  implements WorkflowOrchestratorTypes.IWorkflowsModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: ModulesSdkTypes.InternalModuleService<any>
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
    filters: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO[]> {
    const wfExecutions = await this.workflowExecutionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      WorkflowOrchestratorTypes.WorkflowExecutionDTO[]
    >(wfExecutions, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountWorkflowExecution(
    filters: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps = {},
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
  async run<TWorkflow extends string | ReturnWorkflow<any, any, any>>(
    workflowIdOrWorkflow: TWorkflow,
    options: WorkflowOrchestratorTypes.WorkflowOrchestratorRunDTO<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    > = {},
    @MedusaContext() context: Context = {}
  ) {
    const ret = await this.workflowOrchestratorService_.run<
      TWorkflow extends ReturnWorkflow<any, any, any>
        ? UnwrapWorkflowInputDataType<TWorkflow>
        : unknown
    >(workflowIdOrWorkflow, options, context)

    return ret as any
  }

  @InjectSharedContext()
  async getRunningTransaction(
    workflowId: string,
    transactionId: string,
    @MedusaContext() context: Context = {}
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
    @MedusaContext() context: Context = {}
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
    @MedusaContext() context: Context = {}
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
    @MedusaContext() context: Context = {}
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
    @MedusaContext() context: Context = {}
  ) {
    return this.workflowOrchestratorService_.unsubscribe(args as any, context)
  }
}

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
  MedusaError,
  isString,
} from "@medusajs/utils"
import type {
  IWorkflowEngineService,
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
  WorkflowOrchestratorTypes,
} from "@medusajs/workflows-sdk"
import { WorkflowOrchestratorService } from "@services"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>
  workflowOrchestratorService: WorkflowOrchestratorService
  redisDisconnectHandler: () => Promise<void>
}

export class WorkflowsModuleService implements IWorkflowEngineService {
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: ModulesSdkTypes.InternalModuleService<any>
  protected workflowOrchestratorService_: WorkflowOrchestratorService
  protected redisDisconnectHandler_: () => Promise<void>

  constructor(
    {
      baseRepository,
      workflowExecutionService,
      workflowOrchestratorService,
      redisDisconnectHandler,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.workflowExecutionService_ = workflowExecutionService
    this.workflowOrchestratorService_ = workflowOrchestratorService
    this.redisDisconnectHandler_ = redisDisconnectHandler
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  __hooks = {
    onApplicationShutdown: async () => {
      await this.workflowOrchestratorService_.onApplicationShutdown()
      await this.redisDisconnectHandler_()
    },
    onApplicationPrepareShutdown: async () => {
      await this.workflowOrchestratorService_.onApplicationPrepareShutdown()
    },
  }

  @InjectManager("baseRepository_")
  async retrieveWorkflowExecution(
    idOrObject:
      | string
      | {
          workflow_id: string
          transaction_id: string
        },
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO> {
    const objValue = isString(idOrObject)
      ? { id: idOrObject }
      : {
          workflow_id: idOrObject.workflow_id,
          transaction_id: idOrObject.transaction_id,
        }

    const wfExecution = await this.workflowExecutionService_.list(
      objValue,
      config,
      sharedContext
    )

    if (wfExecution.length === 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `WorkflowExecution with ${Object.keys(objValue).join(
          ", "
        )}: ${Object.values(objValue).join(", ")} was not found`
      )
    }

    // eslint-disable-next-line max-len
    return await this.baseRepository_.serialize<WorkflowOrchestratorTypes.WorkflowExecutionDTO>(
      wfExecution[0],
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listWorkflowExecution(
    filters: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO[]> {
    if (filters.transaction_id) {
      if (Array.isArray(filters.transaction_id)) {
        filters.transaction_id = {
          $in: filters.transaction_id,
        }
      }
    }

    if (filters.workflow_id) {
      if (Array.isArray(filters.workflow_id)) {
        filters.workflow_id = {
          $in: filters.workflow_id,
        }
      }
    }

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
    if (filters.transaction_id) {
      if (Array.isArray(filters.transaction_id)) {
        filters.transaction_id = {
          $in: filters.transaction_id,
        }
      }
    }

    if (filters.workflow_id) {
      if (Array.isArray(filters.workflow_id)) {
        filters.workflow_id = {
          $in: filters.workflow_id,
        }
      }
    }

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
    return await this.workflowOrchestratorService_.getRunningTransaction(
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
    return await this.workflowOrchestratorService_.setStepSuccess(
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
    return await this.workflowOrchestratorService_.setStepFailure(
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

import {
  Context,
  DAL,
  FindConfig,
  IWorkflowEngineService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  WorkflowsSdkTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectSharedContext,
  isString,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import type {
  ReturnWorkflow,
  UnwrapWorkflowInputDataType,
} from "@medusajs/workflows-sdk"
import { WorkflowOrchestratorService } from "@services"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  workflowExecutionService: ModulesSdkTypes.IMedusaInternalService<any>
  workflowOrchestratorService: WorkflowOrchestratorService
}

export class WorkflowsModuleService implements IWorkflowEngineService {
  protected baseRepository_: DAL.RepositoryService
  protected workflowExecutionService_: ModulesSdkTypes.IMedusaInternalService<any>
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
  async retrieveWorkflowExecution(
    idOrObject:
      | string
      | {
          workflow_id: string
          transaction_id: string
        },
    config: FindConfig<WorkflowsSdkTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowsSdkTypes.WorkflowExecutionDTO> {
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
    return await this.baseRepository_.serialize<WorkflowsSdkTypes.WorkflowExecutionDTO>(
      wfExecution[0],
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listWorkflowExecution(
    filters: WorkflowsSdkTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowsSdkTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<WorkflowsSdkTypes.WorkflowExecutionDTO[]> {
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
      WorkflowsSdkTypes.WorkflowExecutionDTO[]
    >(wfExecutions, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountWorkflowExecution(
    filters: WorkflowsSdkTypes.FilterableWorkflowExecutionProps = {},
    config: FindConfig<WorkflowsSdkTypes.WorkflowExecutionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[WorkflowsSdkTypes.WorkflowExecutionDTO[], number]> {
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
        WorkflowsSdkTypes.WorkflowExecutionDTO[]
      >(wfExecutions, {
        populate: true,
      }),
      count,
    ]
  }

  @InjectSharedContext()
  async run<TWorkflow extends string | ReturnWorkflow<any, any, any>>(
    workflowIdOrWorkflow: TWorkflow,
    options: WorkflowsSdkTypes.WorkflowOrchestratorRunDTO<
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

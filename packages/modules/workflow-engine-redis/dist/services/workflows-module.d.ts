import { Context, DAL, FindConfig, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes } from "@medusajs/types";
import type { IWorkflowEngineService, ReturnWorkflow, UnwrapWorkflowInputDataType, WorkflowOrchestratorTypes } from "@medusajs/workflows-sdk";
import { WorkflowOrchestratorService } from ".";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    workflowExecutionService: ModulesSdkTypes.InternalModuleService<any>;
    workflowOrchestratorService: WorkflowOrchestratorService;
    redisDisconnectHandler: () => Promise<void>;
};
export declare class WorkflowsModuleService implements IWorkflowEngineService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected workflowExecutionService_: ModulesSdkTypes.InternalModuleService<any>;
    protected workflowOrchestratorService_: WorkflowOrchestratorService;
    protected redisDisconnectHandler_: () => Promise<void>;
    constructor({ baseRepository, workflowExecutionService, workflowOrchestratorService, redisDisconnectHandler, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    __hooks: {
        onApplicationShutdown: () => Promise<void>;
        onApplicationPrepareShutdown: () => Promise<void>;
    };
    retrieveWorkflowExecution(idOrObject: string | {
        workflow_id: string;
        transaction_id: string;
    }, config?: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO>, sharedContext?: Context): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO>;
    listWorkflowExecution(filters?: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps, config?: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO>, sharedContext?: Context): Promise<WorkflowOrchestratorTypes.WorkflowExecutionDTO[]>;
    listAndCountWorkflowExecution(filters?: WorkflowOrchestratorTypes.FilterableWorkflowExecutionProps, config?: FindConfig<WorkflowOrchestratorTypes.WorkflowExecutionDTO>, sharedContext?: Context): Promise<[WorkflowOrchestratorTypes.WorkflowExecutionDTO[], number]>;
    run<TWorkflow extends string | ReturnWorkflow<any, any, any>>(workflowIdOrWorkflow: TWorkflow, options?: WorkflowOrchestratorTypes.WorkflowOrchestratorRunDTO<TWorkflow extends ReturnWorkflow<any, any, any> ? UnwrapWorkflowInputDataType<TWorkflow> : unknown>, context?: Context): Promise<any>;
    getRunningTransaction(workflowId: string, transactionId: string, context?: Context): Promise<import("@medusajs/orchestration").DistributedTransaction>;
    setStepSuccess({ idempotencyKey, stepResponse, options, }: {
        idempotencyKey: string | object;
        stepResponse: unknown;
        options?: Record<string, any>;
    }, context?: Context): Promise<any>;
    setStepFailure({ idempotencyKey, stepResponse, options, }: {
        idempotencyKey: string | object;
        stepResponse: unknown;
        options?: Record<string, any>;
    }, context?: Context): Promise<any>;
    subscribe(args: {
        workflowId: string;
        transactionId?: string;
        subscriber: Function;
        subscriberId?: string;
    }, context?: Context): Promise<void>;
    unsubscribe(args: {
        workflowId: string;
        transactionId?: string;
        subscriberOrId: string | Function;
    }, context?: Context): Promise<void>;
}
export {};
//# sourceMappingURL=workflows-module.d.ts.map
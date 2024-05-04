import { Context, MedusaContainer } from "@medusajs/types";
import { DistributedTransaction, OrchestratorBuilder, TransactionMetadata, TransactionModelOptions, TransactionOrchestrator, TransactionStep, TransactionStepHandler, TransactionStepsDefinition } from "../transaction";
export interface WorkflowDefinition {
    id: string;
    handler: (container: MedusaContainer, context?: Context) => TransactionStepHandler;
    orchestrator: TransactionOrchestrator;
    flow_: TransactionStepsDefinition;
    handlers_: Map<string, {
        invoke: WorkflowStepHandler;
        compensate?: WorkflowStepHandler;
    }>;
    options: TransactionModelOptions;
    requiredModules?: Set<string>;
    optionalModules?: Set<string>;
}
export type WorkflowHandler = Map<string, {
    invoke: WorkflowStepHandler;
    compensate?: WorkflowStepHandler;
}>;
export type WorkflowStepHandlerArguments = {
    container: MedusaContainer;
    payload: unknown;
    invoke: {
        [actions: string]: unknown;
    };
    compensate: {
        [actions: string]: unknown;
    };
    metadata: TransactionMetadata;
    transaction: DistributedTransaction;
    step: TransactionStep;
    orchestrator: TransactionOrchestrator;
    context?: Context;
};
export type WorkflowStepHandler = (args: WorkflowStepHandlerArguments) => Promise<unknown>;
export declare class WorkflowManager {
    protected static workflows: Map<string, WorkflowDefinition>;
    static unregister(workflowId: string): void;
    static unregisterAll(): void;
    static getWorkflows(): Map<string, WorkflowDefinition>;
    static getWorkflow(workflowId: string): WorkflowDefinition | undefined;
    static getTransactionDefinition(workflowId: any): OrchestratorBuilder;
    static register(workflowId: string, flow: TransactionStepsDefinition | OrchestratorBuilder | undefined, handlers: WorkflowHandler, options?: TransactionModelOptions, requiredModules?: Set<string>, optionalModules?: Set<string>): void;
    static update(workflowId: string, flow: TransactionStepsDefinition | OrchestratorBuilder, handlers: Map<string, {
        invoke: WorkflowStepHandler;
        compensate?: WorkflowStepHandler;
    }>, options?: TransactionModelOptions, requiredModules?: Set<string>, optionalModules?: Set<string>): void;
    static buildHandlers(handlers: Map<string, {
        invoke: WorkflowStepHandler;
        compensate?: WorkflowStepHandler;
    }>): (container: MedusaContainer, context?: Context) => TransactionStepHandler;
}

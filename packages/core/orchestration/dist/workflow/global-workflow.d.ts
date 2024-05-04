import { Context, LoadedModule, MedusaContainer } from "@medusajs/types";
import { DistributedTransaction, DistributedTransactionEvents } from "../transaction";
import { WorkflowDefinition, WorkflowManager } from "./workflow-manager";
export declare class GlobalWorkflow extends WorkflowManager {
    protected static workflows: Map<string, WorkflowDefinition>;
    protected container: MedusaContainer;
    protected context: Context;
    protected subscribe: DistributedTransactionEvents;
    constructor(modulesLoaded?: LoadedModule[] | MedusaContainer, context?: Context, subscribe?: DistributedTransactionEvents);
    run(workflowId: string, uniqueTransactionId: string, input?: unknown): Promise<DistributedTransaction>;
    registerStepSuccess(workflowId: string, idempotencyKey: string, response?: unknown): Promise<DistributedTransaction>;
    registerStepFailure(workflowId: string, idempotencyKey: string, error?: Error | any): Promise<DistributedTransaction>;
}

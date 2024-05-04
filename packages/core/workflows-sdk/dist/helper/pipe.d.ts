import { DistributedTransaction, TransactionMetadata, WorkflowStepHandler } from "@medusajs/orchestration";
import { Context, MedusaContainer, SharedContext } from "@medusajs/types";
export type WorkflowStepMiddlewareReturn = {
    alias?: string;
    value: any;
};
export type WorkflowStepMiddlewareInput = {
    from: string;
    alias?: string;
};
interface PipelineInput {
    /**
     * The alias of the input data to store in
     */
    inputAlias?: string;
    /**
     * Descriptors to get the data from
     */
    invoke?: WorkflowStepMiddlewareInput | WorkflowStepMiddlewareInput[];
    compensate?: WorkflowStepMiddlewareInput | WorkflowStepMiddlewareInput[];
    onComplete?: (args: WorkflowOnCompleteArguments) => Promise<void>;
    /**
     * Apply the data merging
     */
    merge?: boolean;
    /**
     * Store the merged data in a new key, if this is present no need to set merge: true
     */
    mergeAlias?: string;
    /**
     * Store the merged data from the chosen aliases, if this is present no need to set merge: true
     */
    mergeFrom?: string[];
}
export type WorkflowArguments<T = any> = {
    container: MedusaContainer;
    payload: unknown;
    data: T;
    metadata: TransactionMetadata;
    context: Context | SharedContext;
};
export type WorkflowOnCompleteArguments<T = any> = {
    container: MedusaContainer;
    payload: unknown;
    data: T;
    metadata: TransactionMetadata;
    transaction: DistributedTransaction;
    context: Context | SharedContext;
};
export type PipelineHandler<T extends any = undefined> = (args: WorkflowArguments) => Promise<T extends undefined ? WorkflowStepMiddlewareReturn | WorkflowStepMiddlewareReturn[] : T>;
export declare function pipe<T>(input: PipelineInput, ...functions: [...PipelineHandler[], PipelineHandler<T>]): WorkflowStepHandler;
export {};

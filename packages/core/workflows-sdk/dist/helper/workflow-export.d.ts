import { MainExportedWorkflow } from "./type";
export declare const exportWorkflow: <TData = unknown, TResult = unknown>(workflowId: string, defaultResult?: string | Symbol, dataPreparation?: ((data: TData) => Promise<unknown>) | undefined, options?: {
    wrappedInput?: boolean;
}) => MainExportedWorkflow<TData, TResult>;

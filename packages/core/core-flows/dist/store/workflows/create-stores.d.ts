import { StoreDTO, CreateStoreDTO } from "@medusajs/types";
type WorkflowInput = {
    stores: CreateStoreDTO[];
};
export declare const createStoresWorkflowId = "create-stores";
export declare const createStoresWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, StoreDTO[], Record<string, Function>>;
export {};

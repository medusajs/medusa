import { ApiKeyDTO, CreateApiKeyDTO } from "@medusajs/types";
type WorkflowInput = {
    api_keys: CreateApiKeyDTO[];
};
export declare const createApiKeysWorkflowId = "create-api-keys";
export declare const createApiKeysWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<WorkflowInput, ApiKeyDTO[], Record<string, Function>>;
export {};

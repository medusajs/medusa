import { ApiKeyDTO, FilterableApiKeyProps, UpdateApiKeyDTO } from "@medusajs/types";
type UpdateApiKeysStepInput = {
    selector: FilterableApiKeyProps;
    update: UpdateApiKeyDTO;
};
export declare const updateApiKeysWorkflowId = "update-api-keys";
export declare const updateApiKeysWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateApiKeysStepInput, ApiKeyDTO[], Record<string, Function>>;
export {};

import { ApiKeyDTO, FilterableApiKeyProps, RevokeApiKeyDTO } from "@medusajs/types";
type RevokeApiKeysStepInput = {
    selector: FilterableApiKeyProps;
    revoke: RevokeApiKeyDTO;
};
export declare const revokeApiKeysWorkflowId = "revoke-api-keys";
export declare const revokeApiKeysWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<RevokeApiKeysStepInput, ApiKeyDTO[], Record<string, Function>>;
export {};

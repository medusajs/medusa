import { CreateApiKeyDTO } from "@medusajs/types";
type CreateApiKeysStepInput = {
    api_keys: CreateApiKeyDTO[];
};
export declare const createApiKeysStepId = "create-api-keys";
export declare const createApiKeysStep: import("@medusajs/workflows-sdk").StepFunction<CreateApiKeysStepInput, import("@medusajs/types").ApiKeyDTO[]>;
export {};

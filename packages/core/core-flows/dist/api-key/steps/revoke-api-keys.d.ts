import { FilterableApiKeyProps, RevokeApiKeyDTO } from "@medusajs/types";
type RevokeApiKeysStepInput = {
    selector: FilterableApiKeyProps;
    revoke: RevokeApiKeyDTO;
};
export declare const revokeApiKeysStepId = "revoke-api-keys";
export declare const revokeApiKeysStep: import("@medusajs/workflows-sdk").StepFunction<RevokeApiKeysStepInput, import("@medusajs/types").ApiKeyDTO[]>;
export {};

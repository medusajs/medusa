import { FilterableApiKeyProps, UpdateApiKeyDTO } from "@medusajs/types";
type UpdateApiKeysStepInput = {
    selector: FilterableApiKeyProps;
    update: UpdateApiKeyDTO;
};
export declare const updateApiKeysStepId = "update-api-keys";
export declare const updateApiKeysStep: import("@medusajs/workflows-sdk").StepFunction<UpdateApiKeysStepInput, import("@medusajs/types").ApiKeyDTO[]>;
export {};

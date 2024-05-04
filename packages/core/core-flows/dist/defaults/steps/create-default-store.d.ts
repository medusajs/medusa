import { CreateStoreDTO } from "@medusajs/types";
type CreateDefaultStoreStepInput = {
    store: CreateStoreDTO;
};
export declare const createDefaultStoreStepId = "create-default-store";
export declare const createDefaultStoreStep: import("@medusajs/workflows-sdk").StepFunction<CreateDefaultStoreStepInput, any>;
export {};

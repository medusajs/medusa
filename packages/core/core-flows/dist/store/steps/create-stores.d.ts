import { CreateStoreDTO } from "@medusajs/types";
type CreateStoresStepInput = {
    stores: CreateStoreDTO[];
};
export declare const createStoresStepId = "create-stores";
export declare const createStoresStep: import("@medusajs/workflows-sdk").StepFunction<CreateStoresStepInput, import("@medusajs/types").StoreDTO[]>;
export {};

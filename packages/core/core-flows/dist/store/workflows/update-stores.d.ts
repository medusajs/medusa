import { StoreDTO, FilterableStoreProps, UpdateStoreDTO } from "@medusajs/types";
type UpdateStoresStepInput = {
    selector: FilterableStoreProps;
    update: UpdateStoreDTO;
};
export declare const updateStoresWorkflowId = "update-stores";
export declare const updateStoresWorkflow: import("@medusajs/workflows-sdk").ReturnWorkflow<UpdateStoresStepInput, StoreDTO[], Record<string, Function>>;
export {};

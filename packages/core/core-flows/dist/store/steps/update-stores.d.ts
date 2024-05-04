import { FilterableStoreProps, UpdateStoreDTO } from "@medusajs/types";
type UpdateStoresStepInput = {
    selector: FilterableStoreProps;
    update: UpdateStoreDTO;
};
export declare const updateStoresStepId = "update-stores";
export declare const updateStoresStep: import("@medusajs/workflows-sdk").StepFunction<UpdateStoresStepInput, import("@medusajs/types").StoreDTO[]>;
export {};

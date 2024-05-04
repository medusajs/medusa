import { FilterableRegionProps, UpdateRegionDTO } from "@medusajs/types";
type UpdateRegionsStepInput = {
    selector: FilterableRegionProps;
    update: UpdateRegionDTO;
};
export declare const updateRegionsStepId = "update-region";
export declare const updateRegionsStep: import("@medusajs/workflows-sdk").StepFunction<UpdateRegionsStepInput, import("@medusajs/types").RegionDTO[]>;
export {};

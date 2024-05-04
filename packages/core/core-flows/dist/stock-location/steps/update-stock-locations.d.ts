import { FilterableStockLocationProps } from "@medusajs/types";
import { UpdateStockLocationInput } from "@medusajs/types";
interface StepInput {
    selector: FilterableStockLocationProps;
    update: UpdateStockLocationInput;
}
export declare const updateStockLocationsStepId = "update-stock-locations-step";
export declare const updateStockLocationsStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, import("@medusajs/types").StockLocationDTO[]>;
export {};

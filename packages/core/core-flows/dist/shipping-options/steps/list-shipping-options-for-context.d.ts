import { FindConfig, ShippingOptionDTO } from "@medusajs/types";
interface StepInput {
    context: Record<string, unknown>;
    config?: FindConfig<ShippingOptionDTO>;
}
export declare const listShippingOptionsForContextStepId = "list-shipping-options-for-context";
export declare const listShippingOptionsForContextStep: import("@medusajs/workflows-sdk").StepFunction<StepInput, ShippingOptionDTO[]>;
export {};
